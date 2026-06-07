import { useState, useRef, useCallback, useEffect } from "react";
import Tooltip from "./Tooltip";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 5;

const STEPS = [
  "Reading document…",
  "Stripping layout & encoding noise…",
  "Rebuilding structure as Markdown…",
  "Counting tokens…",
  "Done.",
];

const FINALIZING_MSGS = [
  "Parsing document pages…",
  "Extracting text and structure…",
  "Stripping encoding noise…",
  "Rebuilding as clean Markdown…",
  "Preserving headings and tables…",
  "Counting your token savings…",
  "Almost there…",
];

const SAMPLES = [
  { name: "research-report.pdf", ext: "PDF", size: "1.4 MB", raw: 72400, md: 4820,
    body: `# Q3 Research Report\n\nQuarterly performance summary across product, growth, and retention.\n\n## Key findings\n- Retention rose **14%** quarter over quarter\n- Mobile now drives **61%** of all sessions\n- Activation time dropped from 4.2 to **2.8 days**\n\n## Methodology\nData drawn from 12,400 active accounts over 90 days…` },
];

function fmtSize(b) { return b > 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1e3)) + " KB"; }
function extOf(name) { const p = name.split(".").pop().toUpperCase(); return p.length > 4 ? "FILE" : p; }

function useCountUp(target, active, duration = 800) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active || !target) return;
    const start = performance.now();
    const run = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * e));
      if (t < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, duration]);
  return val;
}

function SaveCard({ label, value, accent, animate, suffix = "" }) {
  const n = useCountUp(value, animate);
  return (
    <div className={`save-card${accent ? " win" : ""}`}>
      <div className="k">{label}</div>
      <div className="v">{animate ? n.toLocaleString() : value.toLocaleString()}{suffix}</div>
    </div>
  );
}

export default function Tool() {
  const [state, setState] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [current, setCurrent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [finalizingMsgIdx, setFinalizingMsgIdx] = useState(0);

  useEffect(() => {
    if (state !== "finalizing") { setFinalizingMsgIdx(0); return; }
    const timer = setInterval(() => {
      setFinalizingMsgIdx((i) => (i + 1) % FINALIZING_MSGS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [state]);
  const fileInputRef = useRef(null);
  const dzRef = useRef(null);

  const flash = useCallback(() => {
    if (!dzRef.current) return;
    dzRef.current.classList.add("flash-ring");
    setTimeout(() => dzRef.current?.classList.remove("flash-ring"), 700);
  }, []);

  const runProgress = useCallback((onDone) => {
    let p = 0, si = 0;
    const tick = setInterval(() => {
      p += 6 + Math.random() * 10;
      if (p > 100) p = 100;
      setProgress(p);
      const next = Math.min(STEPS.length - 1, Math.floor(p / 22));
      if (next !== si) { si = next; setStepIdx(next); }
      if (p >= 100) { clearInterval(tick); setTimeout(onDone, 380); }
    }, 130);
  }, []);

  const startConvert = useCallback((s) => {
    setCurrent(s);
    setProgress(0);
    setStepIdx(0);
    setState("processing");
    flash();
    runProgress(() => setState("done"));
  }, [flash, runProgress]);

  const handleRealFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList);

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (files.length > MAX_FILES) {
      setErrMsg(`Maximum ${MAX_FILES} files per upload`);
      return;
    }
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setErrMsg(`${oversized.name} exceeds the 20 MB limit`);
      return;
    }
    setErrMsg(null);

    const totalSize = fmtSize(files.reduce((s, f) => s + f.size, 0));
    const displayName = files.length === 1 ? files[0].name : `${files.length} files`;
    const ext = files.length === 1 ? extOf(files[0].name) : "FILES";

    setCurrent({ name: displayName, ext, size: totalSize, raw: 0, md: 0, body: "", fileCount: files.length });
    setProgress(0);
    setStepIdx(0);
    setState("processing");
    flash();

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    let apiResults = null;
    let apiError = null;
    const apiCall = fetch("/convert", { method: "POST", body: formData })
      .then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(new Error(e.detail || "Conversion failed")));
        return r.json();
      })
      .then((data) => { apiResults = data; })
      .catch((e) => { apiError = e.message || "Conversion failed"; });

    runProgress(async () => {
      setState("finalizing");
      await apiCall;
      if (apiError) {
        setErrMsg(apiError);
        setState("idle");
        return;
      }
      if (apiResults && apiResults.length > 0) {
        const combined = apiResults.length === 1
          ? apiResults[0].markdown
          : apiResults.map((r) => `# ${r.filename}\n\n${r.markdown}`).join("\n\n---\n\n");
        const totalRaw = apiResults.reduce((s, r) => s + r.tokens_before, 0);
        const totalMd = apiResults.reduce((s, r) => s + r.tokens_after, 0);
        const outName = apiResults.length === 1 ? apiResults[0].filename : "combined.md";
        setCurrent({
          name: outName,
          ext,
          size: totalSize,
          raw: totalRaw,
          md: totalMd,
          body: combined,
          fileCount: apiResults.length,
        });
      }
      setState("done");
    });
  }, [flash, runProgress]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.length) handleRealFiles(files);
  }, [handleRealFiles]);

  const copyMd = () => {
    const text = current?.body || "";
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const downloadMd = () => {
    const text = current?.body || "";
    const filename = current?.fileCount > 1
      ? "combined.md"
      : (current?.name || "output").replace(/\.[^.]+$/, ".md");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ringR = 54;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc * (1 - progress / 100);

  const outFilename = current?.fileCount > 1
    ? "combined.md"
    : (current?.name || "output").replace(/\.[^.]+$/, ".md");

  const mdPreviewHTML = (current?.body || "").slice(0, 800)
    .replace(/^(#{1,3} .+)$/gm, '<span class="mh">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<span class="mb">$1</span>');

  return (
    <div className="tool" id="tool">
      <div
        ref={dzRef}
        className={`dz${isDragging ? " drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {/* IDLE */}
        {state === "idle" && (
          <div className="dz-idle">
            <div className="drop-icon">
              <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7 9m5-5l5 5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>
            </div>
            <h3>Drag &amp; drop your documents</h3>
            <p>
              or <span className="browse" onClick={() => fileInputRef.current?.click()}>browse to upload</span>
              <Tooltip placement="top" content="PDF · DOCX · DOC · TXT · MD · HTML · PPTX · XLSX — up to 5 files · 20 MB each">
                <span className="fmt-info">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </span>
              </Tooltip>
            </p>
            {errMsg && (
              <p style={{ color: "var(--warn)", fontSize: "13px", marginTop: "12px", fontFamily: "ui-monospace,SF Mono,Menlo,monospace" }}>
                ⚠ {errMsg}
              </p>
            )}
            <div className="samples">
              {SAMPLES.map((s, i) => (
                <span key={i} className="chip" onClick={() => startConvert(s)}>
                  {s.name} <span className="ext">· {s.size}</span>
                </span>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              accept=".pdf,.docx,.doc,.txt,.md,.html,.pptx,.xlsx"
              onChange={(e) => { if (e.target.files?.length) handleRealFiles(e.target.files); }}
            />
          </div>
        )}

        {/* PROCESSING */}
        {state === "processing" && current && (
          <div className="dz-proc">
            <div className="ring-wrap">
              <svg viewBox="0 0 124 124" className="ring-svg">
                <circle cx="62" cy="62" r={ringR} className="ring-track" />
                <circle
                  cx="62" cy="62" r={ringR} className="ring-fill"
                  style={{ strokeDasharray: ringCirc, strokeDashoffset: ringOffset }}
                />
              </svg>
              <div className="ring-inner">
                <span className="ring-pct">{Math.round(progress)}<span className="ring-pct-sym">%</span></span>
                <span className="ring-label">tokens freed</span>
              </div>
            </div>
            <div className="ring-step">{STEPS[stepIdx]}</div>
            <div className="ring-fname">{current.fileCount > 1 ? `${current.fileCount} files` : current.name}</div>
          </div>
        )}

        {/* FINALIZING */}
        {state === "finalizing" && (
          <div className="dz-finalizing">
            <div className="spin-ring" />
            <p className="finalizing-msg" key={finalizingMsgIdx}>{FINALIZING_MSGS[finalizingMsgIdx]}</p>
            <p className="finalizing-sub">Large files may take a few seconds — hang tight</p>
          </div>
        )}

        {/* DONE */}
        {state === "done" && current && (
          <div className="dz-done">
            <div className="done-head">
              <div className="ttl">
                <span className="ok">
                  <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                </span>
                Clean Markdown ready
              </div>
              <span className="done-fname">{outFilename}</span>
            </div>
            <div className="md-out" dangerouslySetInnerHTML={{ __html: mdPreviewHTML }} />
            {(() => {
              const rawT = current.raw || Math.max(4200, Math.round((current.fileCount || 1) * 24000));
              const mdT  = current.md  || Math.round(rawT * 0.067);
              const pct  = Math.round((1 - mdT / rawT) * 100);
              return (
                <div className="savings-strip">
                  <SaveCard label="Original" value={rawT} accent={false} animate={true} />
                  <SaveCard label="Markdown" value={mdT} accent={false} animate={true} />
                  <SaveCard label="Reduction" value={pct} accent={true} animate={true} suffix="%" />
                </div>
              );
            })()}
            <div className="done-actions">
              <button className="btn btn-accent" onClick={downloadMd}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V4m0 0L7 9m5-5l5 5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
                </svg>
                Download .md
              </button>
              <button className="btn btn-ghost" onClick={copyMd}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>
                </svg>
                {copied ? "Copied ✓" : "Copy Markdown"}
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--faint)", fontFamily: "inherit", transition: "color 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--muted)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--faint)"}
                onClick={() => { setState("idle"); setCurrent(null); }}
              >
                ↩ Convert another
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="powered">
        <span className="ms-mark">▦</span>
        Powered by Microsoft's open-source{" "}
        <a href="https://github.com/microsoft/markitdown" target="_blank" rel="noopener noreferrer">MarkItDown</a> engine
      </div>
    </div>
  );
}

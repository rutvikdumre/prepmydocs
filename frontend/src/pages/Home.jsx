import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ── Token Flow Animation ─────────────────────────────────── */
function PdfIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 1H3a2 2 0 00-2 2v20a2 2 0 002 2h16a2 2 0 002-2V7L13 1z"/>
      <polyline points="13 1 13 7 21 7"/>
      <line x1="7" y1="13" x2="15" y2="13"/>
      <line x1="7" y1="17" x2="15" y2="17"/>
    </svg>
  );
}

function MdIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 1H3a2 2 0 00-2 2v20a2 2 0 002 2h16a2 2 0 002-2V7L13 1z"/>
      <polyline points="13 1 13 7 21 7"/>
      <text x="4" y="20" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none"># MD</text>
    </svg>
  );
}

function TokenFlow() {
  return (
    <motion.div
      className="tf-wrap"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      <div className="tf-grid">
        {/* Before — PDF */}
        <motion.div
          className="tf-file"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="tf-icon tf-icon-pdf"><PdfIcon /></div>
          <div className="tf-fname">report.pdf</div>
          <div className="tf-count tf-count-warn">72,400 tokens</div>
          <div className="tf-bar-track">
            <motion.div
              className="tf-bar-fill tf-bar-warn"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="tf-arrow-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="0" y1="7" x2="22" y2="7"/>
            <polyline points="16,2 22,7 16,12"/>
          </svg>
          <span className="tf-arrow-label">MarkItDown</span>
        </motion.div>

        {/* After — MD */}
        <motion.div
          className="tf-file"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.6 }}
        >
          <div className="tf-icon-row">
            <div className="tf-icon tf-icon-md"><MdIcon /></div>
            <motion.span
              className="tf-ai-tag"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 2.2 }}
            >
              AI-ready
            </motion.span>
          </div>
          <div className="tf-fname">report.md</div>
          <div className="tf-count tf-count-good">4,820 tokens</div>
          <div className="tf-bar-track">
            <motion.div
              className="tf-bar-fill tf-bar-good"
              initial={{ width: 0 }}
              animate={{ width: "7%" }}
              transition={{ duration: 0.5, delay: 1.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="tf-stat-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.4 }}
      >
        <span className="tf-reduction">93% fewer tokens</span>
        <span className="tf-ai-note">Better understood by your AI</span>
      </motion.div>
    </motion.div>
  );
}
import Tool from "../components/Tool";
import Tooltip from "../components/Tooltip";

function scrollToTool() {
  const el = document.getElementById("tool");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function triggerUpload() {
  document.querySelector("#tool input[type='file']")?.click();
}

/* Reveal-on-scroll hook using IntersectionObserver */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          en.target.querySelectorAll?.(".meter-fill[data-w]").forEach((m) => {
            m.style.width = m.dataset.w + "%";
          });
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Hero ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <header className="hero-header">
      <div className="wrap hero-grid">
        {/* Left */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow">
            <span className="pip" />
            A developmyai micro-tool
          </span>
          <h1 className="hero-h1">
            Prep your docs for AI.<br />
            <span className="l2">Right format. <span style={{ color: "var(--accent)" }}>Zero wasted tokens.</span></span>
          </h1>
          <p className="sub">
            Drop in a PDF or Word doc and get back clean Markdown, the format AI models were
            actually trained to read. Stop burning context just to upload a file. Keep it for the answer.
          </p>
          <div className="hero-cta">
            <button className="btn btn-accent" style={{ fontSize: "16px", padding: "14px 26px" }} onClick={triggerUpload}>
              Try PrepMyDocs
            </button>
            <div className="cta-note">
              <span className="check">✓</span>
              No sign-up · No data stored · Always free
            </div>
          </div>
          <TokenFlow />
        </motion.div>

        {/* Right — the tool */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
          <Tool />
        </motion.div>
      </div>
    </header>
  );
}

/* ── Before / After ───────────────────────────────────────── */
function BeforeAfter() {
  return (
    <section className="blk" id="compare">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="kicker">Before &amp; after</div>
          <h2>The same document. A fraction of the context.</h2>
          <p className="lead">
            Feeding a raw 40-page PDF straight to your AI eats most of its working memory before it
            reads a single word. Markdown carries the same meaning at a fraction of the size.
          </p>
        </div>

        <div className="ba-grid reveal">
          {/* Before */}
          <div className="ba-card before">
            <div className="ba-label">
              <span className="ba-tag bad">● Raw PDF upload</span>
              <span className="ba-fname">research-report.pdf</span>
            </div>
            <div className="ba-num">72,400<span className="u">tokens</span></div>
            <div className="ba-sub">~89% of a typical context window</div>
            <div className="meter">
              <div className="meter-track">
                <div className="meter-fill bad" data-w="92" />
              </div>
              <div className="meter-cap"><span>context used</span><span>92%</span></div>
            </div>
            <div className="ba-foot">
              Bloated layout data, encoding noise, and repeated formatting leave{" "}
              <strong>almost no room</strong> for your actual question, or the answer.
            </div>
          </div>

          {/* After */}
          <div className="ba-card after">
            <div className="ba-label">
              <span className="ba-tag good">● Clean Markdown</span>
              <span className="ba-fname">research-report.md</span>
            </div>
            <div className="ba-num accent">4,820<span className="u">tokens</span></div>
            <div className="ba-sub">~6% of the same context window</div>
            <div className="meter">
              <div className="meter-track">
                <div className="meter-fill good" data-w="6" />
              </div>
              <div className="meter-cap"><span>context used</span><span>6%</span></div>
            </div>
            <div className="ba-foot">
              Pure structure and text. Your AI spends its memory on{" "}
              <strong>thinking</strong>, not parsing, so the answers go deeper.
            </div>
          </div>
        </div>

        <div className="savings-banner reveal">
          You just freed up <b>67,580 tokens</b>. That's room for dozens more pages of real conversation.
        </div>
      </div>
    </section>
  );
}

/* ── How it works ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01", title: "Upload",
      body: "Drag in a PDF, Word doc, or text file. It's sent to our server, converted, then immediately deleted. Nothing is kept.",
      icon: <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7 9m5-5l5 5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>,
    },
    {
      n: "02", title: "Convert",
      body: "We run your file through Microsoft's open-source MarkItDown engine, stripping the noise and rebuilding it as clean Markdown with headings, lists, and tables intact.",
      icon: <svg viewBox="0 0 24 24"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>,
    },
    {
      n: "03", title: "Copy",
      body: "One click to copy. Paste it into ChatGPT, Claude, or Gemini, then get straight to the good part.",
      icon: <svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>,
    },
  ];

  return (
    <section className="blk" id="how" style={{ paddingTop: "30px" }}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="kicker">How it works</div>
          <h2>Three steps. About ten seconds.</h2>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card reveal">
              <div className="step-n">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {i < steps.length - 1 && (
                <div className="step-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-6-6l6 6-6 6"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Why Markdown ─────────────────────────────────────────── */
function WhyMarkdown() {
  return (
    <section className="blk" id="why">
      <div className="wrap why-grid">
        <div className="reveal">
          <div className="kicker">Why Markdown</div>
          <h2 style={{ marginBottom: "24px" }}>It's the language AI grew up reading.</h2>
          <p className="why-body">
            The models you use every day were trained on a huge slice of the public web, and an
            enormous amount of that text was written in <strong>Markdown</strong>. Documentation,
            README files, forum posts, knowledge bases. So when you hand an AI Markdown, you're
            speaking its native tongue: it recognises the headings, the lists, the structure
            instantly, with none of the clutter a raw file drags along.{" "}
            <strong>Cleaner input, clearer thinking, better answers</strong> — without you
            spending a single extra token on formatting.
          </p>
        </div>

        <div className="code-pane reveal">
          <div className="cp-bar">
            <span className="d" /><span className="d" /><span className="d" />
            <span className="lbl">research-report.md</span>
          </div>
          <pre>
            <span className="ch"># Q3 Research Report</span>{"\n\n"}
            <span className="cb">A clear summary your model reads instantly.</span>{"\n\n"}
            <span className="ch">## Key findings</span>{"\n"}
            {"- Retention rose "}<span className="cb">14%</span>{" quarter over quarter\n"}
            {"- Mobile now drives "}<span className="cb">61%</span>{" of sessions\n\n"}
            <span className="ch">## Methodology</span>{"\n"}
            <span className="cc">Structure preserved. Noise removed.</span>{"\n"}
            <span className="cc">Every token earns its place.</span>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="cta-final" id="cta">
      <div className="cta-band" />
      <div className="wrap reveal">
        <h2>Give your AI more room to think.</h2>
        <p>Convert your documents free. No account, no catch. Just cleaner docs and smarter answers.</p>
        <button className="btn btn-accent" onClick={triggerUpload}>
          Try PrepMyDocs
        </button>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="pmd-footer" id="tools">
      <div className="wrap foot-in">
        <div className="foot-lib">
          <strong style={{ color: "var(--muted)" }}>PrepMyDocs</strong> is part of{" "}
          <a href="https://developmyai.com">developmyai</a>, a growing library of small, sharp
          tools that help you use AI better.
        </div>
        <div className="foot-links">
          <a href="#how">How it works</a>
          <a href="#why">Why Markdown</a>
          <Link to="/blog">Blog</Link>
          <Tooltip placement="top" content="Files are uploaded to our server for conversion and immediately deleted. No data is stored, logged, or shared with third parties.">
            <span style={{ cursor: "default", color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: "2px" }}>Privacy</span>
          </Tooltip>
          <a href="#">More tools ↗</a>
        </div>
      </div>
      <div className="wrap">
        <div className="powered">
          <span className="ms-mark">▦</span>
          Powered by Microsoft's open-source{" "}
          <a href="https://github.com/microsoft/markitdown" target="_blank" rel="noopener noreferrer">
            MarkItDown
          </a>{" "}
          engine
        </div>
      </div>
    </footer>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Home() {
  useReveal();

  return (
    <>
      <div className="page-glow" />
      <Hero />
      <BeforeAfter />
      <HowItWorks />
      <WhyMarkdown />
      <FinalCTA />
      <Footer />
    </>
  );
}

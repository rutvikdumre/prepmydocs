import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TokenSavingsBadge from "./TokenSavingsBadge";

export default function Editor({ results, onReset }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const active = results[activeIdx];

  const totalSaved = results.reduce((s, r) => s + r.tokens_saved, 0);
  const totalBefore = results.reduce((s, r) => s + r.tokens_before, 0);
  const totalPercent = totalBefore > 0 ? Math.round((totalSaved / totalBefore) * 100) : 0;

  const downloadOne = (r) => {
    const blob = new Blob([r.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = r.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => results.forEach(downloadOne);

  return (
    <div className="w-full max-w-6xl mx-auto px-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <TokenSavingsBadge tokensSaved={totalSaved} savingsPercent={totalPercent} />
        <div className="flex items-center gap-3">
          {results.length > 1 && (
            <button
              onClick={downloadAll}
              className="bg-[#4169E1] hover:bg-[#3358C4] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
            >
              Download All ({results.length})
            </button>
          )}
          <button
            onClick={() => downloadOne(active)}
            className={`font-semibold text-sm px-5 py-2.5 rounded-full transition-colors ${
              results.length > 1
                ? "border border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white"
                : "bg-[#4169E1] hover:bg-[#3358C4] text-white"
            }`}
          >
            Download .md
          </button>
          <button
            onClick={onReset}
            className="text-[#888888] text-sm hover:text-[#1A1A1A] transition-colors underline"
          >
            Convert more files
          </button>
        </div>
      </div>

      {/* Aggregate stats */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <StatPill label="Files converted" value={results.length} color="text-[#4169E1]" />
        <StatPill label="Total tokens before" value={totalBefore.toLocaleString()} color="text-red-500" />
        <StatPill label="Total tokens after" value={(totalBefore - totalSaved).toLocaleString()} color="text-[#4169E1]" />
        <StatPill label="Total saved" value={totalSaved.toLocaleString()} color="text-[#22C55E]" />
      </div>

      {/* File tabs (only shown for multiple files) */}
      {results.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors truncate max-w-[160px] ${
                i === activeIdx
                  ? "bg-[#4169E1] text-white border-[#4169E1]"
                  : "bg-white text-[#888888] border-[#E5E5E5] hover:border-[#4169E1] hover:text-[#4169E1]"
              }`}
              title={r.filename}
            >
              {r.filename}
            </button>
          ))}
        </div>
      )}

      {/* Per-file stats */}
      {results.length > 1 && (
        <div className="flex gap-3 mb-4 flex-wrap text-xs">
          <span className="text-[#888888]">
            <span className="font-medium text-[#1A1A1A]">{active.filename}</span>
            {" · "}
            {active.tokens_before.toLocaleString()} → {active.tokens_after.toLocaleString()} tokens
            {" · "}
            <span className="text-[#22C55E] font-semibold">{active.savings_percent}% saved</span>
          </span>
        </div>
      )}

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow border border-[#E5E5E5] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#E5E5E5] px-4 py-3">
            <span className="text-xs font-semibold text-[#888888] uppercase tracking-wide">Preview</span>
            <span className="ml-auto text-xs text-[#888888] truncate max-w-[200px]">{active.filename}</span>
          </div>
          <div className="p-5 overflow-auto max-h-[520px] prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.markdown}</ReactMarkdown>
          </div>
        </div>

        <div className="bg-[#1A1A2E] rounded-2xl shadow overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#2A2A4A] px-4 py-3">
            <span className="text-xs font-semibold text-[#8888BB] uppercase tracking-wide">Raw Markdown</span>
            <CopyButton text={active.markdown} />
          </div>
          <pre className="p-5 overflow-auto max-h-[520px] text-xs text-[#CCCCDD] font-mono leading-relaxed whitespace-pre-wrap">
            {active.markdown}
          </pre>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-auto text-xs text-[#8888BB] hover:text-white transition-colors border border-[#3A3A5A] rounded px-2.5 py-1 hover:border-[#4169E1]"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] px-4 py-2.5 shadow-sm">
      <p className="text-[#888888] text-xs mb-0.5">{label}</p>
      <p className={`font-bold text-sm tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

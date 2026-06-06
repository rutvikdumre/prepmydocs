import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center h-full">
      <motion.span
        {...fadeUp(0)}
        className="inline-flex items-center self-start gap-1.5 bg-[#22C55E]/10 text-[#16A34A] text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-[#22C55E]/20"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block animate-pulse" />
        Save up to 80% of tokens
      </motion.span>

      <motion.h1
        {...fadeUp(0.08)}
        className="text-[2.6rem] leading-[1.12] font-extrabold text-[#1A1A1A] mb-4 tracking-tight"
      >
        Stop Burning AI Credits<br />Before You've Said a Word
      </motion.h1>

      <motion.p {...fadeUp(0.16)} className="text-[#888888] text-base leading-relaxed mb-7 max-w-[440px]">
        Convert any file to Markdown first —{" "}
        <Tooltip content="Same words, same structure. Markdown strips the binary overhead that inflates token counts in raw PDFs, DOCX, and PPTX files." placement="bottom">
          <span className="text-[#1A1A1A] font-medium border-b border-dashed border-[#888888] cursor-help">
            same content, 5× fewer tokens
          </span>
        </Tooltip>
        , and already in the format AI was trained on.
      </motion.p>

      {/* Terminal block */}
      <motion.div
        {...fadeUp(0.24)}
        className="bg-[#0D0D1A] rounded-xl p-5 font-mono text-sm mb-6 shadow-xl max-w-[400px] border border-[#2A2A4A]"
      >
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <span className="text-[#444466] text-xs ml-2 select-none">token-cost.sh</span>
        </div>
        <div className="space-y-2 text-[13px]">
          <div>
            <span className="text-[#4169E1]">$ </span>
            <span className="text-[#7C8FCC]">compare-tokens report.pdf</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#555577]">raw PDF</span>
            <span className="text-[#9999BB]">~60,000 tokens</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#555577]">after MarkSave</span>
            <span className="text-[#9999BB]">~11,000 tokens</span>
          </div>
          <div className="h-px bg-[#1E1E35] my-1" />
          <div className="flex justify-between items-center font-semibold">
            <span className="text-[#7C8FCC]">saved</span>
            <span className="text-[#22C55E]">~49,000 tokens (82%) ✓</span>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.32)} className="flex items-center gap-2">
        <Tooltip
          content="Powered by Microsoft's open-source MarkItDown library. Supports PDF, DOCX, PPTX, XLSX, images, audio, HTML, ZIP, and more."
          placement="right"
        >
          <span className="text-[#888888] text-xs flex items-center gap-1.5 cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            No data stored · Open source
            <svg className="w-3 h-3 text-[#AAAAAA]" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v5M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
        </Tooltip>
      </motion.div>
    </div>
  );
}

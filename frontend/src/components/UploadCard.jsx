import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

const SAMPLE_CHIPS = ["50-page PDF", "PowerPoint Deck", "Spreadsheet"];

const FORMATS_TOOLTIP = "PDF · DOCX · PPTX · XLSX · XLS · HTML · CSV · JSON · XML · TXT · MD · ZIP · JPG · PNG · MP3 · WAV";

export default function UploadCard({ onConversionComplete, onLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList).filter(Boolean);
      if (!files.length) return;
      setError(null);
      onLoading(true);

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      try {
        const res = await fetch("http://localhost:8000/convert", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Conversion failed");
        }
        onConversionComplete(await res.json());
      } catch (e) {
        setError(e.message);
        onLoading(false);
      }
    },
    [onConversionComplete, onLoading]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg p-7 w-full max-w-[400px] mx-auto"
    >
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-[#4169E1] hover:bg-[#3358C4] active:scale-[0.98] text-white font-semibold text-base py-3.5 rounded-full transition-all mb-4"
      >
        Upload Your Files
      </button>

      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${
          isDragging ? "drop-zone-active" : "drop-zone-idle"
        }`}
      >
        <motion.div
          animate={{ scale: isDragging ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-3xl mb-2 select-none"
        >
          {isDragging ? "📂" : "📄"}
        </motion.div>
        <p className="text-[#888888] text-sm">or drop one or more files here</p>
        <p className="text-[#AAAAAA] text-xs mt-1">Multiple files supported</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.docx,.pptx,.xlsx,.xls,.html,.htm,.csv,.json,.xml,.txt,.md,.zip,.jpg,.jpeg,.png,.mp3,.wav"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-4"
        >
          {error}
        </motion.div>
      )}

      <div className="flex gap-2 flex-wrap mb-4">
        {SAMPLE_CHIPS.map((chip) => (
          <span
            key={chip}
            className="text-xs border border-[#E5E5E5] text-[#888888] rounded-lg px-3 py-1.5 cursor-default hover:border-[#4169E1] hover:text-[#4169E1] transition-colors"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-[#AAAAAA]">
        <Tooltip content={FORMATS_TOOLTIP} placement="top">
          <span className="flex items-center gap-1 cursor-default hover:text-[#888888] transition-colors">
            16 formats supported
            <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v5M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
        </Tooltip>
        <a href="#" className="hover:text-[#888888] transition-colors">Terms</a>
      </div>
    </motion.div>
  );
}

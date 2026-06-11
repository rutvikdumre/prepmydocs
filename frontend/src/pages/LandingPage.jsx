import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion, useMotionValue, useSpring, useTransform, AnimatePresence,
} from "framer-motion";

/* ── Tool registry ─────────────────────────────────────────── */
// Add new tools here — each needs an id, copy, and an animation component below.
const TOOLS = [
  {
    id: "prepmydocs",
    tag: "File prep",
    name: "PrepMyDocs",
    liner: "Get your file into a format your AI can actually work with.",
    stat: "93% fewer tokens",
    href: "/prepmydocs",
    soon: false,
  },
  {
    id: "contextswitch",
    tag: "Context migration",
    name: "ContextSwitch",
    liner: "Take your conversation with you when you switch AI tools.",
    stat: null,
    href: null,
    soon: true,
  },
];

/* ── Shared helpers ─────────────────────────────────────────── */
function fu(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.46, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

/* ── PrepMyDocs animation ──────────────────────────────────── */
function PrepMyDocsAnim() {
  const R = 20;
  const circ = +(2 * Math.PI * R).toFixed(2);
  return (
    <div className="ta-grid">

      {/* PDF — left */}
      <motion.div className="ta-col"
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.36, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
        <div className="ta-icon ta-pdf" aria-label="PDF file">
          <svg viewBox="0 0 18 22" fill="none" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 1H3a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7L11 1z"/>
            <polyline points="11,1 11,7 17,7"/>
          </svg>
          <span>PDF</span>
        </div>
        <div className="ta-num ta-num-warn">72,400</div>
        <div className="ta-lbl">tokens</div>
        <div className="ta-track">
          <motion.div className="ta-fill ta-fill-warn"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}/>
        </div>
      </motion.div>

      {/* Processor ring — middle */}
      <motion.div className="ta-proc"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.38, delay: 0.85, type: "spring", stiffness: 210, damping: 20 }}>
        <svg viewBox="0 0 52 52" className="ta-ring" aria-hidden="true">
          {/* Track */}
          <circle cx="26" cy="26" r={R} fill="none" stroke="var(--border)" strokeWidth="2.5"/>
          {/* Fill arc */}
          <motion.circle cx="26" cy="26" r={R} fill="none"
            stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: 0 }}
            transform="rotate(-90 26 26)"
            transition={{ duration: 0.9, delay: 1.1, ease: "easeInOut" }}/>
          {/* Centre dot */}
          <motion.circle cx="26" cy="26" r="5" fill="var(--accent)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 0.25, delay: 1.85 }}/>
        </svg>
        <span className="ta-proc-lbl">MarkItDown</span>
      </motion.div>

      {/* MD — right */}
      <motion.div className="ta-col"
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.36, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}>
        <div className="ta-icon ta-md" aria-label="Markdown file">
          <span className="ta-hash">#</span>
        </div>
        <div className="ta-num ta-num-good">4,820</div>
        <div className="ta-lbl">tokens</div>
        <div className="ta-track">
          <motion.div className="ta-fill ta-fill-good"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: "left", width: "7%" }}
            transition={{ duration: 0.36, delay: 2.3, ease: "easeOut" }}/>
        </div>
      </motion.div>
    </div>
  );
}

/* ── ContextSwitch animation (coming soon — dimmed placeholder) */
function ContextSwitchAnim() {
  return (
    <div className="ta-grid ta-dim">
      <div className="ta-col">
        <div className="ta-icon ta-chat" aria-label="Chat export">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <div className="ta-num ta-num-muted">Chat export</div>
        <div className="ta-lbl">your AI</div>
        <div className="ta-track"><div className="ta-fill ta-fill-muted" style={{ width: "75%" }}/></div>
      </div>

      <div className="ta-proc">
        <div className="ta-arrow-box" aria-hidden="true">
          <svg viewBox="0 0 32 16" fill="none" stroke="var(--faint)" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="8" x2="26" y2="8"/>
            <polyline points="20,3 26,8 20,13"/>
          </svg>
        </div>
        <span className="ta-proc-lbl">Migrate</span>
      </div>

      <div className="ta-col">
        <div className="ta-icon ta-doc" aria-label="Summary document">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="14" y2="17"/>
          </svg>
        </div>
        <div className="ta-num ta-num-muted">Summary</div>
        <div className="ta-lbl">any AI</div>
        <div className="ta-track"><div className="ta-fill ta-fill-muted" style={{ width: "28%" }}/></div>
      </div>
    </div>
  );
}

/* Route new tool ids to their animation components here */
function ToolAnimation({ toolId }) {
  if (toolId === "prepmydocs")   return <PrepMyDocsAnim />;
  if (toolId === "contextswitch") return <ContextSwitchAnim />;
  return null;
}

/* ── Tilt card stack ─────────────────────────────────────────── */
function TiltCardStack({ mouseX, mouseY }) {
  const [idx, setIdx] = useState(0);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), { stiffness: 110, damping: 24 });
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [ 8, -8]), { stiffness: 110, damping: 24 });

  function go(delta = 1) {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIdx((i) => (i + delta + TOOLS.length) % TOOLS.length);
  }

  const tool = TOOLS[idx];

  return (
    <div className="htc-wrap">
      <div className="htc-scene" onClick={() => go(1)} role="button"
        aria-label="Click to view next tool">
        <div className="htc-layer htc-layer-b" />
        <div className="htc-layer htc-layer-a" />

        <AnimatePresence mode="wait">
          <motion.article
            key={idx}
            className={`htc-card${tool.soon ? " htc-card-soon" : ""}`}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={  { opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Header */}
            <div className="htc-top">
              <span className="htc-tag">{tool.tag}</span>
              {tool.soon
                ? <span className="htc-soon-pill">Coming soon</span>
                : <span className="htc-mark" aria-hidden="true">▦</span>}
            </div>

            <h3 className="htc-name">{tool.name}</h3>

            {/* Animation zone */}
            <div className="htc-anim-zone">
              <ToolAnimation toolId={tool.id} />
              {tool.stat && (
                <motion.div className="ta-stat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.6 }}>
                  {tool.stat}
                </motion.div>
              )}
            </div>

            <p className="htc-liner">{tool.liner}</p>

            {/* Footer */}
            <div className="htc-foot">
              {!tool.soon && tool.href && (
                <Link to={tool.href} className="btn btn-accent"
                  style={{ flex: 1, justifyContent: "center", fontSize: "14px", padding: "10px 18px" }}
                  onClick={(e) => e.stopPropagation()}>
                  Try PrepMyDocs
                </Link>
              )}
              {tool.soon && (
                <span className="htc-soon-cue">Click anywhere on the card to go back</span>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="htc-dots" role="tablist" aria-label="Tool selector">
        {TOOLS.map((t, i) => (
          <span key={i} role="tab" aria-selected={i === idx}
            className={`htc-dot${i === idx ? " htc-dot-on" : ""}`}
            onClick={(e) => { e.stopPropagation(); go(i - idx); }}
            aria-label={`View ${t.name}`}/>
        ))}
      </div>
      <p className="htc-hint">Click the card to browse tools</p>
    </div>
  );
}

/* ── Hero section ─────────────────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  function onMouseMove(e) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <>
      <div className="page-glow" />
      <header ref={heroRef} className="dmai-hero"
        onMouseMove={onMouseMove}
        onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}>
        <div className="wrap dmai-hero-grid">

          {/* Left column */}
          <div className="dmai-hero-left">
            <motion.div {...fu(0)} className="dmai-badge">
              <span className="dmai-badge-pip" />
              Works with ChatGPT, Claude, Copilot, Gemini, or any AI you use
            </motion.div>

            <motion.h1 {...fu(0.08)} className="dmai-h1">
              Get More Out of Your AI
            </motion.h1>

            <motion.p {...fu(0.16)} className="dmai-sub">
              Tools built around the way you already work with AI.
            </motion.p>

            <motion.div {...fu(0.24)} className="dmai-cta-group">
              <button className="btn btn-accent"
                style={{ fontSize: "16px", padding: "14px 26px" }}
                onClick={() => navigate("/prepmydocs")}>
                Try PrepMyDocs
              </button>
              <p className="dmai-cta-note">Free. Open. Ready when you are.</p>
            </motion.div>
          </div>

          {/* Right column — animated card stack */}
          <motion.div {...fu(0.16)} className="dmai-hero-right">
            <TiltCardStack mouseX={mouseX} mouseY={mouseY} />
          </motion.div>

        </div>
      </header>
    </>
  );
}

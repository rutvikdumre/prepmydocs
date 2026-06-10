import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

const TOOLS = [
  {
    tag: "File prep",
    name: "PrepMyDocs",
    liner: "Get your file into a format your AI can actually work with.",
    input: "Your PDF, Word doc, or spreadsheet",
    output: "Clean text, ready to paste into your AI",
    stat: "93% fewer tokens",
    href: "/prepmydocs",
    soon: false,
  },
  {
    tag: "Context migration",
    name: "ContextSwitch",
    liner: "Take your conversation with you when you switch AI tools.",
    input: "Your chat export or paste",
    output: "A formatted summary your next AI can pick up from",
    stat: null,
    href: null,
    soon: true,
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

function AiBadge() {
  return (
    <motion.div {...fadeUp(0)} className="dmai-badge">
      <span className="dmai-badge-pip" />
      Works with ChatGPT, Claude, Copilot, Gemini, or any AI you use
    </motion.div>
  );
}

function CardContent({ tool, onCtaClick }) {
  return (
    <>
      <div className="htc-top">
        <span className="htc-tag">{tool.tag}</span>
        {tool.soon
          ? <span className="htc-soon-badge">Coming soon</span>
          : <span className="htc-mark">▦</span>
        }
      </div>

      <h3 className={`htc-name${tool.soon ? " htc-name-dim" : ""}`}>{tool.name}</h3>
      <p className="htc-liner">{tool.liner}</p>

      <div className={`htc-io${tool.soon ? " htc-io-dim" : ""}`}>
        <div className="htc-io-row">
          <span className="htc-pill htc-pill-in">In</span>
          <span className="htc-io-val">{tool.input}</span>
        </div>
        <div className="htc-io-divider">↓</div>
        <div className="htc-io-row">
          <span className="htc-pill htc-pill-out">Out</span>
          <span className="htc-io-val">{tool.output}</span>
        </div>
      </div>

      <div className="htc-foot">
        {tool.stat && <span className="htc-stat">{tool.stat}</span>}
        {!tool.soon && tool.href && (
          <Link
            to={tool.href}
            className="btn btn-sm btn-accent"
            onClick={(e) => e.stopPropagation()}
          >
            Try PrepMyDocs
          </Link>
        )}
        {tool.soon && (
          <span className="htc-soon-hint">Click to go back</span>
        )}
      </div>
    </>
  );
}

function TiltCardStack({ mouseX, mouseY }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-14, 14]), { stiffness: 110, damping: 24 });
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [9, -9]), { stiffness: 110, damping: 24 });

  function handleClick() {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setActiveIdx((i) => (i + 1) % TOOLS.length);
  }

  const tool = TOOLS[activeIdx];

  return (
    <div className="htc-scene-wrap">
      <div className="htc-scene" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="htc-layer htc-layer-b" />
        <div className="htc-layer htc-layer-a" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className={`htc-card${tool.soon ? " htc-card-soon" : ""}`}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <CardContent tool={tool} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="htc-dots">
        {TOOLS.map((_, i) => (
          <span
            key={i}
            className={`htc-dot${i === activeIdx ? " htc-dot-active" : ""}`}
            onClick={(e) => { e.stopPropagation(); mouseX.set(0.5); mouseY.set(0.5); setActiveIdx(i); }}
          />
        ))}
      </div>

      <p className="htc-cycle-hint">Click the card to browse tools</p>
    </div>
  );
}

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

  function onMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <>
      <div className="page-glow" />
      <header
        ref={heroRef}
        className="dmai-hero"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="wrap dmai-hero-grid">
          {/* Left */}
          <div className="dmai-hero-left">
            <AiBadge />

            <motion.h1 {...fadeUp(0.08)} className="dmai-h1">
              Get More Out of Your AI
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="dmai-sub">
              Tools built around the way you already work with AI.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="dmai-cta-group">
              <button
                className="btn btn-accent"
                style={{ fontSize: "16px", padding: "14px 26px" }}
                onClick={() => navigate("/prepmydocs")}
              >
                Try PrepMyDocs
              </button>
              <p className="dmai-cta-note">Free. Open. Ready when you are.</p>
            </motion.div>
          </div>

          {/* Right */}
          <motion.div {...fadeUp(0.18)} className="dmai-hero-right">
            <TiltCardStack mouseX={mouseX} mouseY={mouseY} />
          </motion.div>
        </div>
      </header>
    </>
  );
}

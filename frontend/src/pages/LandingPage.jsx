import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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

function ToolCard({ mouseX, mouseY }) {
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-14, 14]), {
    stiffness: 110,
    damping: 24,
  });
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [9, -9]), {
    stiffness: 110,
    damping: 24,
  });

  return (
    <div className="htc-scene">
      <div className="htc-layer htc-layer-b" />
      <div className="htc-layer htc-layer-a" />
      <motion.div
        className="htc-card"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="htc-top">
          <span className="htc-tag">File prep</span>
          <span className="htc-mark">▦</span>
        </div>

        <h3 className="htc-name">PrepMyDocs</h3>
        <p className="htc-liner">
          Get your file into a format your AI can actually work with.
        </p>

        <div className="htc-io">
          <div className="htc-io-row">
            <span className="htc-pill htc-pill-in">In</span>
            <span className="htc-io-val">Your PDF, Word doc, or spreadsheet</span>
          </div>
          <div className="htc-io-divider">↓</div>
          <div className="htc-io-row">
            <span className="htc-pill htc-pill-out">Out</span>
            <span className="htc-io-val">Clean text, ready to paste into your AI</span>
          </div>
        </div>

        <div className="htc-foot">
          <span className="htc-stat">93% fewer tokens</span>
          <Link to="/prepmydocs" className="btn btn-sm btn-accent">
            Try it free
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Hero({ heroRef, mouseX, mouseY, onMouseMove, onMouseLeave }) {
  return (
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
              onClick={() =>
                document
                  .getElementById("tools")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Your Tools
            </button>
            <p className="dmai-cta-note">Free. Open. Ready when you are.</p>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          {...fadeUp(0.18)}
          className="dmai-hero-right"
        >
          <ToolCard mouseX={mouseX} mouseY={mouseY} />
        </motion.div>
      </div>
    </header>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
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
      <Hero
        heroRef={heroRef}
        mouseX={mouseX}
        mouseY={mouseY}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    </>
  );
}

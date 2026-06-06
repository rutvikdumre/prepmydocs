import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { posts } from "../data/posts";

export function PageFooter() {
  return (
    <footer className="pmd-footer">
      <div className="wrap foot-in">
        <div className="foot-lib">
          <strong style={{ color: "var(--muted)" }}>PrepMyDocs</strong> is part of{" "}
          <a href="https://developmyai.com">developmyai</a>, a growing library of small, sharp tools that help you use AI better.
        </div>
        <div className="foot-links">
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <a href="https://github.com/microsoft/markitdown" target="_blank" rel="noopener noreferrer">MarkItDown ↗</a>
        </div>
      </div>
    </footer>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndex() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-glow" />
      <main className="wrap" style={{ paddingTop: "64px", paddingBottom: "64px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: "48px" }}
        >
          <div className="kicker">Blog</div>
          <h1 style={{ fontSize: "clamp(30px,4.2vw,46px)", fontWeight: 700, color: "var(--text)", marginTop: "8px", marginBottom: "12px" }}>
            Learn &amp; Save
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "18px", maxWidth: "50ch" }}>
            Guides on AI token costs, Markdown conversion, and getting more out of every prompt.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                style={{ display: "block", background: "var(--bg-2)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius)", padding: "24px", textDecoration: "none", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-line)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-soft)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "ui-monospace,SF Mono,Menlo,monospace", fontSize: "11px", color: "var(--accent)", background: "var(--accent-dim)", padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {post.category}
                  </span>
                  <span style={{ fontFamily: "ui-monospace,SF Mono,Menlo,monospace", fontSize: "12px", color: "var(--faint)" }}>{formatDate(post.date)}</span>
                  <span style={{ fontFamily: "ui-monospace,SF Mono,Menlo,monospace", fontSize: "12px", color: "var(--faint)" }}>· {post.readTime}</span>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text)", marginBottom: "8px", lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6 }}>{post.description}</p>
                <span style={{ display: "inline-block", marginTop: "16px", fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}>
                  Read article →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <PageFooter />
    </div>
  );
}

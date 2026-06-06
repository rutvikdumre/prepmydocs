import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getPost, posts } from "../data/posts";
import { PageFooter } from "./BlogIndex";

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100, background: "var(--border-soft)" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", transition: "width 0.05s linear" }} />
    </div>
  );
}

function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "ui-monospace,SF Mono,Menlo,monospace", fontSize: "12px", color: "var(--faint)", transition: "color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color = "var(--muted)"}
      onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}
    >
      {copied ? "copied!" : "copy"}
    </button>
  );
}

const mdComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    if (!inline && match) {
      return (
        <div style={{ margin: "24px 0", borderRadius: "12px", overflow: "hidden", border: "1px solid oklch(0.22 0.02 264)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "oklch(0.12 0.015 264)", padding: "10px 16px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
            </div>
            <span style={{ fontFamily: "ui-monospace,SF Mono,Menlo,monospace", fontSize: "11px", color: "oklch(0.45 0.04 264)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{match[1]}</span>
            <CopyCodeButton code={code} />
          </div>
          <SyntaxHighlighter style={nightOwl} language={match[1]} PreTag="div"
            customStyle={{ margin: 0, borderRadius: 0, padding: "18px", fontSize: "13px", lineHeight: "1.7", background: "oklch(0.13 0.013 264)" }}
            {...props}
          >{code}</SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code style={{ background: "var(--bg-3)", color: "var(--accent)", fontSize: "0.85em", padding: "2px 6px", borderRadius: "5px", fontFamily: "ui-monospace,SF Mono,Menlo,monospace" }} {...props}>
        {children}
      </code>
    );
  },
  h2: ({ children }) => <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)", marginTop: "48px", marginBottom: "16px", letterSpacing: "-0.02em" }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)", marginTop: "32px", marginBottom: "12px" }}>{children}</h3>,
  p:  ({ children }) => <p  style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "20px", fontSize: "16px" }}>{children}</p>,
  ul: ({ children }) => <ul style={{ marginBottom: "20px", paddingLeft: "20px" }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ marginBottom: "20px", paddingLeft: "20px", listStyleType: "decimal" }}>{children}</ol>,
  li: ({ children }) => <li style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.65, marginBottom: "6px", listStyleType: "disc" }}>{children}</li>,
  a:  ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>{children}</a>,
  strong: ({ children }) => <strong style={{ color: "var(--text)", fontWeight: 600 }}>{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: "3px solid var(--accent)", paddingLeft: "16px", margin: "20px 0", background: "var(--bg-2)", padding: "12px 16px", borderRadius: "0 8px 8px 0", color: "var(--muted)", fontStyle: "italic" }}>
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "24px 0", borderRadius: "12px", border: "1px solid var(--border-soft)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: "var(--bg-3)" }}>{children}</thead>,
  th: ({ children }) => <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "var(--text)", borderBottom: "1px solid var(--border-soft)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: "12px 16px", color: "var(--muted)", borderBottom: "1px solid var(--border-soft)" }}>{children}</td>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid var(--border-soft)", margin: "32px 0" }} />,
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <Navigate to="/blog" replace />;
  const others = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <ReadingProgress />
      <div className="page-glow" />

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "56px 28px 80px", position: "relative", zIndex: 1 }}>
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--faint)", marginBottom: "32px" }}
        >
          <Link to="/" style={{ color: "var(--faint)", transition: "color 0.15s" }} onMouseEnter={e=>e.target.style.color="var(--accent)"} onMouseLeave={e=>e.target.style.color="var(--faint)"}>Home</Link>
          <span>/</span>
          <Link to="/blog" style={{ color: "var(--faint)", transition: "color 0.15s" }} onMouseEnter={e=>e.target.style.color="var(--accent)"} onMouseLeave={e=>e.target.style.color="var(--faint)"}>Blog</Link>
          <span>/</span>
          <span style={{ color: "var(--muted)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</span>
        </motion.nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span className="mono" style={{ fontSize: "11px", color: "var(--accent)", background: "var(--accent-dim)", padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {post.category}
            </span>
            <span className="mono" style={{ fontSize: "12px", color: "var(--faint)" }}>{formatDate(post.date)}</span>
            <span className="mono" style={{ fontSize: "12px", color: "var(--faint)" }}>· {post.readTime}</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "var(--text)", lineHeight: 1.15, marginBottom: "16px", letterSpacing: "-0.03em" }}>
            {post.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "17px", lineHeight: 1.55 }}>{post.description}</p>
        </motion.div>

        {/* CTA banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          style={{ background: "var(--bg-2)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}
        >
          <div>
            <p style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px", marginBottom: "2px" }}>Try PrepMyDocs free on DevelopMyAI</p>
            <p style={{ color: "var(--faint)", fontSize: "12px", fontFamily: "ui-monospace,SF Mono,Menlo,monospace" }}>Upload any file → clean Markdown → save up to 80% of tokens</p>
          </div>
          <Link to="/" className="btn btn-accent" style={{ fontSize: "13px", padding: "9px 16px", flexShrink: 0 }}>
            Convert a file →
          </Link>
        </motion.div>

        {/* Body */}
        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
          style={{ marginTop: "48px", background: "var(--bg-2)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius)", padding: "32px", textAlign: "center" }}
        >
          <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)", marginBottom: "8px", letterSpacing: "-0.02em" }}>Ready to stop wasting tokens?</p>
          <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "24px" }}>
            Free at <span style={{ color: "var(--accent)", fontWeight: 600 }}>developmyai.com</span> — no sign-up required.
          </p>
          <Link to="/" className="btn btn-accent" style={{ fontSize: "15px", padding: "13px 28px" }}>
            Convert your file now
          </Link>
        </motion.div>

        {/* Related */}
        {others.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <div className="kicker" style={{ marginBottom: "16px" }}>More articles</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {others.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`}
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "16px 20px", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-line)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-soft)"}
                >
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{p.title}</p>
                  <p className="mono" style={{ fontSize: "12px", color: "var(--faint)", marginTop: "4px" }}>{p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  );
}

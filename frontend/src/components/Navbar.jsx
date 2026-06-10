import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

function triggerUpload() {
  document.querySelector("#tool input[type='file']")?.click();
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

export default function Navbar() {
  const [authMode, setAuthMode] = useState(null);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const onPrepmydocs = location.pathname === "/prepmydocs";

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pmd-theme", next);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  function handleUploadClick() {
    if (onPrepmydocs) {
      triggerUpload();
    } else {
      navigate("/prepmydocs");
    }
  }

  return (
    <>
      <nav className="pmd-nav" ref={navRef}>
        <div className="wrap nav-in">
          <Link to="/" className="brand">
            <span className="dot" />
            <span className="crumb">developmyai</span>
            {onPrepmydocs && (
              <>
                <span className="sep">/</span>
                <span>prepmydocs</span>
              </>
            )}
          </Link>

          <div className="nav-links">
            {onPrepmydocs && (
              <>
                <a href="#how" className="hide-sm">How it works</a>
                <a href="#why" className="hide-sm">Why Markdown</a>
              </>
            )}
            <Link to="/blog" className="hide-sm">Blog</Link>
            <Link to="/" className="hide-sm">Tools</Link>

            <button className="nav-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            <button className="btn btn-accent btn-sm hide-sm" onClick={handleUploadClick}>
              Upload docs
            </button>

            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="nav-mobile-menu">
            {onPrepmydocs && (
              <>
                <a href="#how" onClick={closeMenu}>How it works</a>
                <a href="#why" onClick={closeMenu}>Why Markdown</a>
              </>
            )}
            <Link to="/blog" onClick={closeMenu}>Blog</Link>
            <Link to="/" onClick={closeMenu}>Tools</Link>
            <button
              className="btn btn-accent"
              style={{ marginTop: "4px" }}
              onClick={() => { closeMenu(); handleUploadClick(); }}
            >
              Upload docs
            </button>
          </div>
        )}
      </nav>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  );
}

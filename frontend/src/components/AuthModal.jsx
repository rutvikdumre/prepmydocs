import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ mode, onClose }) {
  const [tab, setTab] = useState(mode); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#888888] hover:text-[#1A1A1A] transition-colors text-lg leading-none"
          >
            ×
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#4169E1] text-xl">✦</span>
            <span className="font-bold text-[#1A1A1A]">MarkSave</span>
          </div>

          {submitted ? (
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-bold text-[#1A1A1A] text-lg mb-1">
                {tab === "signup" ? "You're on the list!" : "Welcome back!"}
              </p>
              <p className="text-[#888888] text-sm">
                {tab === "signup"
                  ? "Account features are launching soon. We'll email you at " + email + " when they're ready."
                  : "Account login is launching very soon. Stay tuned!"}
              </p>
              <button
                onClick={onClose}
                className="mt-5 w-full bg-[#4169E1] hover:bg-[#3358C4] text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
              >
                Got it
              </button>
            </motion.div>
          ) : (
            <>
              {/* Tab toggle */}
              <div className="flex bg-[#F7F7F7] rounded-full p-1 mb-6">
                {["login", "signup"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      tab === t ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#888888]"
                    }`}
                  >
                    {t === "login" ? "Log in" : "Sign up"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {tab === "signup" && (
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] transition-colors"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4169E1] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4169E1] hover:bg-[#3358C4] disabled:opacity-60 text-white font-semibold py-2.5 rounded-full transition-colors text-sm mt-1 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {tab === "login" ? "Log in" : "Create account"}
                </button>
              </form>

              {tab === "login" && (
                <p className="text-center text-xs text-[#888888] mt-3">
                  <a href="#" className="text-[#4169E1] hover:underline">Forgot password?</a>
                </p>
              )}
              <p className="text-center text-xs text-[#888888] mt-3">
                {tab === "login" ? "No account? " : "Already have one? "}
                <button
                  onClick={() => setTab(tab === "login" ? "signup" : "login")}
                  className="text-[#4169E1] hover:underline"
                >
                  {tab === "login" ? "Sign up free" : "Log in"}
                </button>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

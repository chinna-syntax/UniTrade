import React, { useEffect, useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── SCROLL PROGRESS BAR ────────────────────────────────────────────────────
export function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setWidth(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${width}%` }}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

// ─── BACK TO TOP BUTTON ──────────────────────────────────────────────────────
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 888,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px 9px 12px",
            background: "#09090B",
            color: "white",
            border: "none",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          Back to top
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── TOAST SYSTEM ────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "default", duration = 3500) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ICONS = {
    success: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    info: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9998,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={() => removeToast(toast.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 18px",
                background: "#18181B",
                color: "#FAFAFA",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
                pointerEvents: "auto",
                cursor: "pointer",
                userSelect: "none",
                maxWidth: "90vw",
              }}
            >
              {ICONS[toast.type] || (
                <span style={{ width: 7, height: 7, background: "#A1A1AA", borderRadius: "50%", flexShrink: 0 }} />
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastNotify() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastNotify must be used inside ToastProvider");
  return ctx;
}

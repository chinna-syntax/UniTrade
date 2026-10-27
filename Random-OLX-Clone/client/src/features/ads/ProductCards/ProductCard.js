import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CONDITIONS = ["Like New", "Good", "Fair", "Move-out"];
const COND_STYLES = [
  { bg: "rgba(22,163,74,0.13)",  color: "#15803D", dot: "#22C55E" },
  { bg: "rgba(79,70,229,0.12)",  color: "#4338CA", dot: "#6366F1" },
  { bg: "rgba(217,119,6,0.12)",  color: "#B45309", dot: "#F59E0B" },
  { bg: "rgba(124,58,237,0.12)", color: "#6D28D9", dot: "#8B5CF6" },
];

function hashId(id = "") {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function formatINR(price) {
  if (!price && price !== 0) return "Price on request";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}

function timeAgo(d) {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Guaranteed fallback if all images fail
const FALLBACK = "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop";

// ─── QUICK VIEW MODAL ─────────────────────────────────────────────────────────
function QuickView({ product, condIdx, onClose }) {
  const cond = COND_STYLES[condIdx];
  const city = product.address?.city || product.address?.state || "India";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(9,9,11,0.7)",
        backdropFilter: "blur(12px) saturate(180%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        layoutId={`card-${product._id}`}
        className="quick-view-dialog"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        style={{
          width: "100%", maxWidth: 540,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(24px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.15) inset",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
          <img
            src={product.productpic1 || FALLBACK}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />

          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 32, height: 32, background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)", border: "none", borderRadius: "50%",
              color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Condition */}
          <div style={{
            position: "absolute", bottom: 12, left: 12,
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 12px", background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)", borderRadius: 999,
            fontSize: 11, fontWeight: 700, color: cond.color,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cond.dot }} />
            {CONDITIONS[condIdx]}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "22px 26px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, fontWeight: 800, color: "#09090B", letterSpacing: "-0.03em", lineHeight: 1.3 }}>
              {product.title}
            </h2>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#09090B", letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
              {formatINR(product.price)}
            </span>
          </div>

          <p style={{ fontSize: 13.5, color: "#71717A", lineHeight: 1.7, marginBottom: 18 }}>{product.description}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
            {[
              { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", text: city },
              { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", text: product.seller || "Senior Student" },
            ].map((t, i) => (
              <div key={i} className="tag" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
                {t.text}
              </div>
            ))}
          </div>

          <motion.a
            href={`/preview_ad/${product._id}`}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px 0",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              color: "white", borderRadius: 12,
              fontWeight: 700, fontSize: 14, textDecoration: "none",
              fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(79,70,229,0.3)",
            }}
          >
            View Full Listing
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── PREMIUM PRODUCT CARD ──────────────────────────────────────────────────────
export default function ProductCard({ product, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const h = hashId(product._id);
  const condIdx = h % CONDITIONS.length;
  const cond = COND_STYLES[condIdx];
  const city = product.address?.city || product.address?.state || "India";

  return (
    <>
      <motion.article
        layoutId={`card-${product._id}`}
        onClick={() => setExpanded(true)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
        whileTap={{ scale: 0.975 }}
        style={{
          cursor: "pointer",
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          // Glassmorphism card
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          // Gradient border
          border: "1px solid rgba(255, 255, 255, 0.6)",
          // Ambient shadow with deeper lift on hover
          boxShadow: hovered
            ? "0 20px 40px -15px rgba(0,0,0,0.18), 0 8px 16px -4px rgba(79,70,229,0.08), 0 0 0 1px rgba(79,70,229,0.08)"
            : "0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* ── IMAGE ─────────────────────────────────────────────────────── */}
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "#F4F4F5", flexShrink: 0 }}>
          {/* Skeleton shimmer */}
          {!imgLoaded && (
            <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
          )}

          {/* Image with zoom on hover */}
          <motion.img
            src={imgError ? FALLBACK : (product.productpic1 || FALLBACK)}
            alt={product.title}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Gradient overlay (stronger on hover) */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(9,9,11,0.4) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />

          {/* Condition badge */}
          <div style={{
            position: "absolute", top: 10, left: 10, zIndex: 2,
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderRadius: 999,
            fontSize: 10.5, fontWeight: 700,
            color: cond.color,
            boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
          }}>
            <span style={{ width: 5.5, height: 5.5, borderRadius: "50%", background: cond.dot, boxShadow: `0 0 5px ${cond.dot}` }} />
            {CONDITIONS[condIdx]}
          </div>

          {/* Heart button — appears on hover */}
          <motion.button
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
            style={{
              position: "absolute", top: 10, right: 10, zIndex: 2,
              width: 32, height: 32,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border: "none", borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.svg
                key={liked ? "heart-on" : "heart-off"}
                width="13" height="13" viewBox="0 0 24 24"
                fill={liked ? "#EF4444" : "none"}
                stroke={liked ? "#EF4444" : "#374151"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}
                transition={{ duration: 0.1 }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </motion.svg>
            </AnimatePresence>
          </motion.button>

          {/* Seller tag at bottom — appears on hover */}
          <motion.div
            className="seller-tag"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute", bottom: 9, left: 9, zIndex: 2,
              padding: "3px 9px",
              background: "rgba(9,9,11,0.65)",
              backdropFilter: "blur(6px)",
              borderRadius: 999,
              fontSize: 10, fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {product.seller || "Block A · 2nd Year"}
          </motion.div>
        </div>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Price */}
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20, fontWeight: 800, color: "#09090B",
            letterSpacing: "-0.03em", display: "block", marginBottom: 5,
          }}>
            {formatINR(product.price)}
          </span>

          {/* Title */}
          <p className="truncate-2" style={{
            fontSize: 13.5, fontWeight: 500, color: "#3F3F46",
            lineHeight: 1.55, flex: 1, marginBottom: 12,
          }}>
            {product.title}
          </p>

          {/* Footer row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: 11.5, color: "#71717A", fontWeight: 500 }}>{city}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: 11, color: "#A1A1AA", fontWeight: 500 }}>{timeAgo(product.createdAt)}</span>
            </div>
          </div>
        </div>
      </motion.article>

      {/* ── QUICK VIEW MODAL ── */}
      <AnimatePresence>
        {expanded && (
          <QuickView
            product={product}
            condIdx={condIdx}
            onClose={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

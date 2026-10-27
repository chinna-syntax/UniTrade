import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdSuccess = () => {
  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <div style={{
          background: "white",
          border: "1px solid #E4E4E7",
          borderRadius: 24,
          padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
        }}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 200 }}
            style={{
              width: 72, height: 72,
              background: "#ECFDF5",
              border: "1px solid rgba(22,163,74,0.2)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          {/* Text */}
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: "#09090B", letterSpacing: "-0.03em", marginBottom: 10 }}>
            Item Listed!
          </h1>
          <p style={{ color: "#71717A", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
            Your item is now live on the campus marketplace.<br />
            Batchmates can see it and reach out to you directly.
          </p>

          {/* Stats row */}
          {[
            { value: "Live", label: "Status" },
            { value: "₹0", label: "Listing fee" },
            { value: "Instant", label: "Visibility" },
          ].map((s, i) => (
            <div key={i} style={{ display: "inline-block", width: "33%", textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: "#09090B", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "#A1A1AA", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/myads" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "13px 0", fontSize: 15 }}
              >
                View My Ads
              </motion.div>
            </Link>
            <Link to="/" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14 }}
              >
                Browse Marketplace
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdSuccess;

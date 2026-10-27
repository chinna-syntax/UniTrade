import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        zIndex: 9999,
        gap: 28,
      }}
    >
      {/* Pulsing logo mark */}
      <div style={{ position: "relative", width: 54, height: 54 }}>
        <div style={{
          position: "absolute", inset: -10,
          borderRadius: "50%",
          border: "2px solid rgba(79, 70, 229, 0.2)",
          animation: "ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite",
        }} />
        <svg width="54" height="54" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12, boxShadow: "0 8px 24px rgba(79,70,229,0.25)" }}>
          <defs>
            <linearGradient id="puLoad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5"/>
              <stop offset="100%" stopColor="#7C3AED"/>
            </linearGradient>
          </defs>
          <rect width="34" height="34" rx="9" fill="url(#puLoad)"/>
          <rect x="8" y="9" width="2.8" height="16" rx="1.4" fill="white"/>
          <path d="M10.8 9h4.2a4 4 0 0 1 0 8h-4.2" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M19 9v10a3.5 3.5 0 0 0 7 0V9" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>


      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#09090B",
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          UniTrade
        </p>

        {/* Skeleton loading bars */}
        <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2563EB",
                animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

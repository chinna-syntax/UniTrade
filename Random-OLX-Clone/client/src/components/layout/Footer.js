import React from "react";
import { Link } from "react-router-dom";

const LINKS = {
  Marketplace: [
    { label: "Browse Listings", href: "/" },
    { label: "Furniture", href: "/Furniture" },
    { label: "Books & Education", href: "/Books & Education" },
    { label: "Electronics", href: "/Electronics & Appliances" },
    { label: "Sell an Item", href: "/sell" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#09090B", color: "#A1A1AA", paddingTop: 64, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 48,
          marginBottom: 56,
        }}>
          {/* Brand */}
          <div style={{ gridColumn: "1 / span 1" }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16, textDecoration: "none" }}>
              <img className="brand-logo footer-logo" src="/logo.png" alt="UniTrade" />
            </Link>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#52525B", maxWidth: 220 }}>
              The campus marketplace for students. Trade gear with batchmates — zero fees, zero hassle.
            </p>

            {/* Demo badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 20,
              padding: "5px 12px",
              background: "rgba(37, 99, 235, 0.1)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#60A5FA",
              textTransform: "uppercase",
            }}>
              <span style={{ width: 5, height: 5, background: "#3B82F6", borderRadius: "50%", boxShadow: "0 0 6px #3B82F6" }} />
              Demo Mode
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#52525B",
                marginBottom: 18,
              }}>
                {title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    style={{
                      fontSize: 14,
                      color: "#71717A",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.target.style.color = "#FAFAFA"}
                    onMouseLeave={e => e.target.style.color = "#71717A"}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#52525B", marginBottom: 18 }}>
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "senior@college.edu" },
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", text: "Campus Hostel, Demo City" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                    <path d={item.icon} />
                  </svg>
                  <span style={{ fontSize: 13.5, color: "#71717A" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#18181B", marginBottom: 24 }} />

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{ fontSize: 13, color: "#3F3F46" }}>
            © 2026 UniTrade
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Help", href: "/help" },
            ].map(item => (
              <Link
                key={item.href}
                to={item.href}
                style={{ fontSize: 13, color: "#3F3F46", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#71717A"}
                onMouseLeave={e => e.target.style.color = "#3F3F46"}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

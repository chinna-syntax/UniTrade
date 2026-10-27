import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modallogin from "../auth/Modallogin";
import axios from "axios";

const backendUrl = "/api";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [staticModal, setStaticModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const name = localStorage.getItem("authname") || "User";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Scroll detection for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Check admin status
  useEffect(() => {
    if (!auth) { setIsAdmin(false); return; }
    const authToken = localStorage.getItem("authToken");
    axios.get(`${backendUrl}/admin/check`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then(r => setIsAdmin(r.data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [auth]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    ["authToken","authemail","authname","authpicture","authphone"].forEach(k => localStorage.removeItem(k));
    setAuth(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`navbar-floating${scrolled ? " scrolled" : ""}`}
        style={{ height: 64, display: "flex", alignItems: "center" }}
      >
        <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 16 }}>

          {/* ─── LOGO ────────────────────────────────────────────── */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <img className="brand-logo navbar-logo" src="/logo.png" alt="UniTrade" />
          </Link>


          {/* ─── SEARCH BAR (desktop) ────────────────────────────── */}
          <form
            onSubmit={handleSearch}
            className="search-pill navbar-search"
            style={{ flex: 1, maxWidth: 440, display: "flex" }}
          >
            <div style={{
              width: 32, height: 32,
              background: "#F4F4F5",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              placeholder="Search campus listings…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span style={{ fontSize: 11, color: "#A1A1AA", background: "#F4F4F5", padding: "3px 7px", borderRadius: 6, fontFamily: "monospace", flexShrink: 0 }}>⏎</span>
          </form>

          {/* ─── RIGHT ACTIONS ────────────────────────────────────── */}
          <div className="navbar-actions" style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>

            {/* Chat icon (if logged in) */}
            {auth && (
              <Link to="/chat" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Messages"
                  style={{
                    width: 36, height: 36,
                    background: "transparent",
                    border: "1px solid #E4E4E7",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </motion.button>
              </Link>
            )}

            {/* Sign in / Avatar */}
            {auth ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(o => !o)}
                  style={{
                    width: 36, height: 36,
                    background: "#09090B",
                    border: "none",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  {initials}
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        right: 0,
                        background: "white",
                        border: "1px solid #E4E4E7",
                        borderRadius: 16,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        minWidth: 220,
                        zIndex: 200,
                        overflow: "hidden",
                        padding: "8px 0",
                      }}
                    >
                      {/* User info */}
                      <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #F4F4F5" }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#09090B", marginBottom: 2 }}>{name}</p>
                        <span className="tag" style={{ fontSize: 11, marginTop: 4 }}>
                          {isAdmin ? "👑 Admin" : "🎓 Student"}
                        </span>
                      </div>

                      {[
                        { label: "My Ads", icon: "M12 2H2l3.09 6.26 1 4h11L20 2z", href: "/myads" },
                        { label: "Edit Profile", icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", href: "/editprofile" },
                        { label: "Messages", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z", href: "/chat" },
                        ...(isAdmin ? [{ label: "Admin Dashboard", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", href: "/admin" }] : []),
                      ].map(item => (
                        <Link key={item.href} to={item.href} style={{ textDecoration: "none" }} onClick={() => setUserMenuOpen(false)}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#F4F4F5"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d={item.icon} />
                            </svg>
                            <span style={{ fontSize: 14, fontWeight: 500, color: "#3F3F46" }}>{item.label}</span>
                          </div>
                        </Link>
                      ))}

                      <div style={{ borderTop: "1px solid #F4F4F5", marginTop: 4, paddingTop: 4 }}>
                        <div
                          onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#FFF1F1"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          <span style={{ fontSize: 14, fontWeight: 500, color: "#EF4444" }}>Sign out</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStaticModal(true)}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid #E4E4E7",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#3F3F46",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Sign in
              </motion.button>
            )}

            {/* List Item CTA */}
            <Link to="/sell" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ fontSize: 13, padding: "9px 16px" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                List an Item
              </motion.button>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: "none",
                width: 36, height: 36,
                background: "transparent",
                border: "1px solid #E4E4E7",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE DRAWER ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 150 }}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0,
                width: 280,
                background: "white",
                zIndex: 160,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: "#09090B" }}>Menu</span>
                <button onClick={() => setMobileOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#71717A" }}>✕</button>
              </div>
              {[
                { label: "Home", href: "/" },
                { label: "Furniture", href: "/Furniture" },
                { label: "Books & Education", href: "/Books & Education" },
                { label: "Electronics", href: "/Electronics & Appliances" },
                ...(auth ? [
                  { label: "My Ads", href: "/myads" },
                  { label: "Messages", href: "/chat" },
                  { label: "Profile", href: "/editprofile" },
                ] : []),
              ].map(item => (
                <Link key={item.href} to={item.href} style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
                  <div style={{ padding: "10px 12px", borderRadius: 10, color: "#3F3F46", fontWeight: 500, fontSize: 15, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F4F4F5"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {!auth ? (
                  <button className="btn-secondary" onClick={() => { setMobileOpen(false); setStaticModal(true); }}>Sign in</button>
                ) : (
                  <button className="btn-secondary" style={{ color: "#EF4444", borderColor: "#FECACA" }} onClick={handleLogout}>Sign out</button>
                )}
                <Link to="/sell" style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>List an Item</button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modallogin setStaticModal={setStaticModal} toggleShow={() => setStaticModal(s => !s)} staticModal={staticModal} />
    </>
  );
}

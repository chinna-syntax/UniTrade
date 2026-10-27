import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import axios from "axios";
import ProductCard from "../features/ads/ProductCards/ProductCard";

// ─── GUARANTEED DEMO PRODUCTS (hardcoded in frontend so server restart is irrelevant) ──
const DEMO_PRODUCTS = [
  {
    _id: "d1",
    title: "Used Mattress (Single Bed)",
    price: 800,
    catagory: "Furniture",
    subcatagory: "Beds & Mattresses",
    description: "Barely used mattress from first year. Good condition, no stains. Comes with a bed sheet. Perfect for hostel rooms.",
    address: { city: "Mumbai", state: "Maharashtra" },
    owner: "Senior Student",
    condition: "Good",
    seller: "Block C • 4th Year",
    productpic1: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: "d2",
    title: "Engineering Drafter Set",
    price: 350,
    catagory: "Books & Education",
    subcatagory: "Stationery",
    description: "Full drafter set with T-square, set squares, protractor, and compass. Used for 2 semesters. All instruments intact.",
    address: { city: "Pune", state: "Maharashtra" },
    owner: "Senior Student",
    condition: "Fair",
    seller: "Block D • Final Year",
    productpic1: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-12"),
  },
  {
    _id: "d3",
    title: "TP-Link WiFi Router",
    price: 600,
    catagory: "Electronics & Appliances",
    subcatagory: "Networking Devices",
    description: "TP-Link router with dual-band support. Works perfectly. Selling because I'm moving out. Can share internet with multiple devices.",
    address: { city: "Bangalore", state: "Karnataka" },
    owner: "Senior Student",
    condition: "Like New",
    seller: "PG Hostel",
    productpic1: "https://images.unsplash.com/photo-1544256718-3b6102715978?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "d4",
    title: "Wooden Study Table",
    price: 1200,
    catagory: "Furniture",
    subcatagory: "Tables & Desks",
    description: "Solid wooden study table with a drawer and shelf. Fits perfectly in a standard hostel room. Self-pickup only.",
    address: { city: "Delhi", state: "Delhi" },
    owner: "Senior Student",
    condition: "Like New",
    seller: "Block A • 2nd Year",
    productpic1: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-18"),
  },
  {
    _id: "d5",
    title: "CS Textbooks Bundle (3rd Year)",
    price: 500,
    catagory: "Books & Education",
    subcatagory: "Textbooks",
    description: "Full set of 3rd year CS textbooks: OS, DBMS, Computer Networks, and Algorithms. All in good condition.",
    address: { city: "Hyderabad", state: "Telangana" },
    owner: "Senior Student",
    condition: "Good",
    seller: "Block B • 3rd Year",
    productpic1: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-20"),
  },
  {
    _id: "d6",
    title: "Bajaj Table Fan — Working",
    price: 450,
    catagory: "Electronics & Appliances",
    subcatagory: "Fans",
    description: "Bajaj table fan, 3-speed settings, works perfectly fine. Selling because I'm buying a bigger fan. Great for hostel summers.",
    address: { city: "Chennai", state: "Tamil Nadu" },
    owner: "Senior Student",
    condition: "Good",
    seller: "PG Hostel",
    productpic1: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-22"),
  },
  {
    _id: "d7",
    title: "Casio Scientific Calculator",
    price: 280,
    catagory: "Books & Education",
    subcatagory: "Stationery",
    description: "Casio FX-991ES Plus. Essential for Engineering maths. Works perfectly, all keys functional.",
    address: { city: "Kolkata", state: "West Bengal" },
    owner: "Senior Student",
    condition: "Good",
    seller: "Block D • Final Year",
    productpic1: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-24"),
  },
  {
    _id: "d8",
    title: "Laptop Stand + USB Hub",
    price: 650,
    catagory: "Electronics & Appliances",
    subcatagory: "Accessories",
    description: "Aluminum laptop stand with a 4-port USB hub. Compatible with all laptops. Great for desk setup.",
    address: { city: "Jaipur", state: "Rajasthan" },
    owner: "Senior Student",
    condition: "Like New",
    seller: "Block A • 2nd Year",
    productpic1: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2024-01-26"),
  },
];

// ─── FILTER CHIPS ────────────────────────────────────────────────────────────
const CHIPS = [
  { label: "All", value: "" },
  { label: "📦 Furniture", value: "Furniture" },
  { label: "📚 Books & Study", value: "Books & Education" },
  { label: "💻 Electronics", value: "Electronics & Appliances" },
];

// ─── FRAMER MOTION VARIANTS ──────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "white", border: "1px solid #F4F4F5", borderRadius: 20, overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 20, width: "40%", borderRadius: 6, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 13, width: "90%", borderRadius: 6, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 13, width: "65%", borderRadius: 6, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 10, width: "55%", borderRadius: 6 }} />
      </div>
    </div>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: "8+", label: "Active Listings" },
  { value: "100%", label: "Verified Sellers" },
  { value: "₹0", label: "Listing Fee" },
  { value: "Instant", label: "Visibility" },
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  const [serverProducts, setServerProducts] = useState([]);
  const [filtered, setFiltered] = useState(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("");

  // Merge server products with demo products
  useEffect(() => {
    axios.get("http://localhost:5000/getProducts")
      .then(r => {
        const live = (r.data || []).filter(p =>
          // Only include server products that have real images (not old placeholders)
          p.productpic1 && !p.productpic1.includes("via.placeholder") && !p.productpic1.includes("picsum.photos")
        );
        setServerProducts(live);
      })
      .catch(() => setServerProducts([]));
  }, []);

  // Combined product list: demo products + any real new user-posted products from server
  const allProducts = [...DEMO_PRODUCTS, ...serverProducts];

  // Filter when chip/search changes
  useEffect(() => {
    let result = allProducts;
    if (activeChip) result = result.filter(p => p.catagory === activeChip);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
    setVisible(8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChip, searchQuery, serverProducts]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
  };

  const hasMore = visible < filtered.length;

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100vh" }}>

      {/* ─── DARK HERO ──────────────────────────────────────────────────────── */}
      <div className="hero-section">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ textAlign: "center" }}
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 14px",
                background: "rgba(79, 70, 229, 0.15)",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                borderRadius: 999,
                fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em",
                color: "#A5B4FC", textTransform: "uppercase", marginBottom: 28,
              }}
            >
              <span style={{ width: 6, height: 6, background: "#818CF8", borderRadius: "50%", boxShadow: "0 0 8px #818CF8" }} />
              Campus Marketplace · Demo Mode
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
                fontWeight: 800, color: "#FAFAFA",
                letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 18,
              }}
            >
              Buy & Sell on Campus.
              <span style={{
                display: "block", marginTop: 6,
                background: "linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #C4B5FD 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Zero fees. Instant.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ fontSize: 16, color: "#71717A", marginBottom: 40, lineHeight: 1.7 }}
            >
              Trade hostel furniture, textbooks, and electronics with verified batchmates.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              onSubmit={handleSearch}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999, padding: "6px 6px 6px 20px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="Search mattress, textbooks, routers…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 15, fontFamily: "inherit" }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{
                  padding: "11px 22px", background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  color: "white", border: "none", borderRadius: 999,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit", flexShrink: 0,
                  boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
                }}
              >
                Search
              </motion.button>
            </motion.form>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 52, flexWrap: "wrap" }}
            >
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#F4F4F5", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#52525B", marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── STICKY FILTER CHIPS ────────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #E4E4E7", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 64, zIndex: 90 }}>
        <div className="responsive-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="category-chips-row" style={{ padding: "12px 0" }}>
            {CHIPS.map(chip => (
              <motion.button
                key={chip.value}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveChip(chip.value)}
                className={`filter-chip${activeChip === chip.value ? " active" : ""}`}
              >
                {chip.label}
              </motion.button>
            ))}
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="filter-chip active"
                onClick={() => setSearchQuery("")}
              >
                ✕ Clear search
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ─── PRODUCT GRID ────────────────────────────────────────────────────── */}
      <div className="responsive-container product-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}
        >
          <div>
            <div className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              {activeChip || "Fresh Listings"}
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#09090B", letterSpacing: "-0.03em" }}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
            </h2>
          </div>
          <Link to="/sell" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#4F46E5", textDecoration: "none" }}>
            Post an item
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "80px 0" }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 16, color: "#71717A", fontWeight: 500 }}>No listings match. Try a different filter.</p>
          </motion.div>
        ) : (
          /* ── STAGGERED GRID REVEAL ── */
          <motion.div
            ref={gridRef}
            variants={gridVariants}
            initial="hidden"
            animate={gridInView ? "show" : "hidden"}
            className="product-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}
          >
            {filtered.slice(0, visible).map((product) => (
              <motion.div
                key={product._id}
                variants={cardVariants}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: "flex", justifyContent: "center", marginTop: 52 }}
          >
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "#4F46E5", color: "#4F46E5" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVisible(v => v + 8)}
              style={{
                padding: "12px 36px",
                background: "transparent",
                border: "1.5px solid #E4E4E7",
                borderRadius: 999, fontWeight: 600, fontSize: 14,
                color: "#3F3F46", cursor: "pointer", fontFamily: "inherit",
                transition: "border-color 0.2s, color 0.2s",
              }}
            >
              Load more listings
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* ─── CTA STRIP ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        style={{ background: "#09090B", padding: "80px 24px", textAlign: "center" }}
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3F3F46", marginBottom: 16 }}>FREE TO POST</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
            color: "#FAFAFA", letterSpacing: "-0.03em", marginBottom: 14,
          }}>
            Got something to sell?
          </h2>
          <p style={{ color: "#71717A", marginBottom: 36, fontSize: 15 }}>
            Reach your entire campus in seconds. No fees, no sign-up hassle.
          </p>
          <motion.a
            href="/sell"
            whileHover={{ scale: 1.04, boxShadow: "0 0 0 4px rgba(79,70,229,0.3)" }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 30px",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              color: "white", borderRadius: 999,
              fontWeight: 700, fontSize: 15, textDecoration: "none",
              boxShadow: "0 8px 32px rgba(79,70,229,0.35)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            List an Item — Free
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}

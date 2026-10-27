import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { categories } from "../common/Catagories";

export default function CatNavbar() {
  const scrollRef = useRef(null);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E4E4E7",
        position: "sticky",
        top: 64,
        zIndex: 90,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          ref={scrollRef}
          className="category-chips-row"
          style={{ padding: "10px 0" }}
        >
          {categories.map((cat, i) => (
            <Link key={i} to={`/${cat.title}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div
                className="filter-chip"
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#EFF6FF";
                  e.currentTarget.style.borderColor = "rgba(37,99,235,0.25)";
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#F4F4F5";
                  e.currentTarget.style.borderColor = "#E4E4E7";
                  e.currentTarget.style.color = "#71717A";
                }}
              >
                {cat.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

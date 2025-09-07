import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ items = [] }) {
  return (
    <aside style={{
      width: 260,
      background: "#0f172a",
      color: "#e2e8f0",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>LMS</div>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            borderRadius: 8,
            color: isActive ? "#0f172a" : "#cbd5e1",
            background: isActive ? "#38bdf8" : "transparent",
            textDecoration: "none",
            fontWeight: 600,
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
}



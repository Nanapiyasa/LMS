import React from "react";

export default function StatCard({ title, value, subtext, accent = "#38bdf8", icon }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      minWidth: 200,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{title}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{value}</div>
      {subtext && <div style={{ fontSize: 12, color: "#64748b" }}>{subtext}</div>}
      <div style={{ height: 3, background: accent, borderRadius: 999 }} />
    </div>
  );
}





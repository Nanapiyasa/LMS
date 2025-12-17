import React from "react";

export default function Topbar({ title = "Dashboard", right = null }) {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {right}
      </div>
    </header>
  );
}





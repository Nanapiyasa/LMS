import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ title, navItems = [], children, right = null }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <Sidebar items={navItems} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title={title} right={right} />
        <main style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {children}
        </main>
      </div>
    </div>
  );
}





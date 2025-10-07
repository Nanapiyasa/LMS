import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function UserMenu({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const email = useMemo(() => user?.email ?? "user", [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (_) {}
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 14, color: "#334155" }}>{email}</span>
      <button onClick={() => navigate("/profile")} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>Profile</button>
      <button onClick={handleLogout} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", color: "#b91c1c", cursor: "pointer" }}>Logout</button>
    </div>
  );
}





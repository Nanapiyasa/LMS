import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseConfig";
import { signOut } from "../utils/supabaseHelpers";

export default function UserMenu({ user }) {
  const navigate = useNavigate();
  const email = useMemo(() => user?.email ?? "user", [user]);

  const onLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 14, color: "#334155" }}>{email}</span>
      <button
        onClick={() => navigate("/profile")}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        Profile
      </button>
      <button
        onClick={onLogout}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ef4444",
          background: "#fee2e2",
          color: "#b91c1c",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}





import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseConfig";
import { getUserData, updateUserProfile } from "../utils/supabaseHelpers";
import DashboardLayout from "../components/DashboardLayout";
import UserMenu from "../components/UserMenu";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const data = await getUserData(user.id);
        if (data) setProfile({ name: data.name || "", email: data.email || user.email || "", role: data.role || "" });
      }
    };
    init();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      setMessage("");
      const updated = await updateUserProfile(user.id, { name: profile.name, email: profile.email });
      setProfile((p) => ({ ...p, name: updated.name, email: updated.email }));
      setMessage("Profile updated successfully");
    } catch (e) {
      setMessage(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const nav = [
    { to: "/", label: "Overview" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <DashboardLayout title="Profile" navItems={nav} right={<UserMenu user={user} /> }>
      <form onSubmit={onSave} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, maxWidth: 560 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Name</span>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Email</span>
            <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Role</span>
            <input value={profile.role} readOnly style={{ padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc" }} />
          </label>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button disabled={saving} type="submit" style={{ padding: "10px 14px", borderRadius: 8, background: "#0ea5e9", color: "#fff", border: 0, cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
          {message && <span style={{ color: "#334155" }}>{message}</span>}
        </div>
      </form>
    </DashboardLayout>
  );
}





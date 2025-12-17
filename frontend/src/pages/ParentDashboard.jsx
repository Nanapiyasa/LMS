import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import UserMenu from "../components/UserMenu";
import { supabase } from "../supabaseConfig";
import React from "react";

export default function ParentDashboard() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);
  const nav = [
    { to: "/", label: "Overview" },
    { to: "/children", label: "Children" },
    { to: "/reports", label: "Reports" },
    { to: "/alerts", label: "Alerts" },
  ];

  return (
    <DashboardLayout title="Parent Dashboard" navItems={nav} right={<UserMenu user={user} /> }>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard title="Children" value="2" subtext="Enrolled" accent="#38bdf8" />
        <StatCard title="Pending Alerts" value="3" subtext="Needs attention" accent="#ef4444" />
        <StatCard title="Attendance" value="96%" subtext="This month" accent="#22c55e" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Recent Updates</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>John - Math test scheduled for Monday</li>
          <li>Emma - Parent-teacher meeting next week</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

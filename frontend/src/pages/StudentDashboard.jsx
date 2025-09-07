import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import UserMenu from "../components/UserMenu";
import { supabase } from "../supabaseConfig";
import React from "react";

export default function StudentDashboard() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);
  const nav = [
    { to: "/", label: "Overview" },
    { to: "/my-courses", label: "My Courses" },
    { to: "/assignments", label: "Assignments" },
    { to: "/progress", label: "Progress" },
  ];

  return (
    <DashboardLayout title="Student Dashboard" navItems={nav} right={<UserMenu user={user} /> }>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard title="Enrolled Courses" value="6" subtext="2 in progress" accent="#6366f1" />
        <StatCard title="Pending Assignments" value="4" subtext="Due this week" accent="#ef4444" />
        <StatCard title="Average Grade" value="B+" subtext="Keep it up!" accent="#22c55e" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Next Up</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Read Chapter 4 - Algebra II - Thu</li>
          <li>Lab Prep - Chemistry - Fri</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

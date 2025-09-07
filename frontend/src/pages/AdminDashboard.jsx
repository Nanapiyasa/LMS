import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import UserMenu from "../components/UserMenu";
import { supabase } from "../supabaseConfig";
import React from "react";

export default function AdminDashboard() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);
  const nav = [
    { to: "/", label: "Overview" },
    { to: "/users", label: "Users" },
    { to: "/courses", label: "Courses" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" navItems={nav} right={<UserMenu user={user} /> }>
      {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16}}>
        <StatCard title="Total Users" value="1,248" subtext="+4.2% this week" accent="#22c55e" />
        <StatCard title="Active Courses" value="58" subtext="+2 new" accent="#6366f1" />
        <StatCard title="Assignments" value="324" subtext="12 due today" accent="#f59e0b" />
        <StatCard title="Support Tickets" value="7" subtext="2 urgent" accent="#ef4444" />
      </div> */}

      {/* <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Recent Activity</h3>
        <ul style={{ margin: 0, paddingLeft: 0 }}>
          <li>New course "Algebra II" created</li>
          <li>Teacher Jane Doe approved</li>
          <li>Student registrations increased</li>
        </ul>
      </div> */}
    </DashboardLayout>
  );
}

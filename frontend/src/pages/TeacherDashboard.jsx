import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import UserMenu from "../components/UserMenu";
import { supabase } from "../supabaseConfig";
import React from "react";

export default function TeacherDashboard() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);
  const nav = [
    { to: "/", label: "Overview" },
    { to: "/my-courses", label: "My Courses" },
    { to: "/assignments", label: "Assignments" },
    { to: "/grades", label: "Grades" },
  ];

  return (
    <DashboardLayout title="Teacher Dashboard" navItems={nav} right={<UserMenu user={user} /> }>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard title="My Courses" value="12" subtext="2 new this term" accent="#38bdf8" />
        <StatCard title="Students" value="284" subtext="+12 this week" accent="#22c55e" />
        <StatCard title="Assignments Due" value="18" subtext="Next 7 days" accent="#f59e0b" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Upcoming Deadlines</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Project Proposal - Class 10B - Fri</li>
          <li>Quiz 3 - Physics 101 - Mon</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}

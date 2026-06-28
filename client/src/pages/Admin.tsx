import "../style/common.css";
import AdminSidebar from "../components/admin/AdminSidebar.tsx";
import AdminDashboard from "../components/admin/AdminDashboard.tsx";
import { AdminRoute } from "../auth/AdminRoute.tsx";
import { useState } from "react";

export type AdminSection = "members" | "responses";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("members");

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:flex-row">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <AdminDashboard activeSection={activeSection} />
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;

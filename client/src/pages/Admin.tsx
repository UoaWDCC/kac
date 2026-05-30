import "../style/common.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar.tsx";
import AdminDashboard from "../components/AdminComponents/AdminDashboard.tsx";
import { AdminRoute } from "../auth/AdminRoute.tsx";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export type AdminSection = "members" | "responses";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("members");
  useEffect(() => {
    const hasShownAdminToast = sessionStorage.getItem("hasShownAdminToast");

    if (!hasShownAdminToast) {
      toast.success("Welcome to the admin dashboard!");

      sessionStorage.setItem("hasShownAdminToast", "true");
    }
  }, []);

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

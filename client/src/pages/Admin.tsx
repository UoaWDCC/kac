import "../style/common.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar.tsx";
import AdminDashboard from "../components/AdminComponents/AdminDashboard.tsx";
import { AdminRoute } from "../auth/AdminRoute.tsx";

const Admin = () => {
    return (
        <AdminRoute>
            <div className="grid grid-cols-[1fr_3fr] gap-2 h-screen margin-4">
                <AdminSidebar />
                <AdminDashboard />
            </div>
        </AdminRoute>
    )
}

export default Admin

import "../style/common.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar.tsx";
import AdminDashboard from "../components/AdminComponents/AdminDashboard.tsx";

const Admin = () => {
    return (
        <div className="grid grid-cols-[1fr_3fr] gap-2 h-screen margin-4">
            <AdminSidebar />
            <AdminDashboard />
        </div>
    )
}

export default Admin

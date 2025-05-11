import ProtectRoute from "@/app/protected/ProtectRoute"
import DashboardPage from "@/components/admin/AdminDashboardPage"

const AdminDashboard = () => {
  return (
    <ProtectRoute allowedRoles={['admin']}>
      <>
      <DashboardPage />
      </>
    </ProtectRoute>
  );
};

export default AdminDashboard;
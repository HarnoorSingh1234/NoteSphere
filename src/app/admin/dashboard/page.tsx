import ProtectRoute from "@/app/(auth)/protected/ProtectRoute"
import DashboardPage from "@/components/admin/AdminDashboardPage"

const AdminDashboard = () => {
  return (
    <ProtectRoute allowedRoles={['ADMIN']}>
      <>
      <DashboardPage />
      </>
    </ProtectRoute>
  );
};

export default AdminDashboard;
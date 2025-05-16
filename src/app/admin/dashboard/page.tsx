"use client"
import ProtectRoute from "@/app/(auth)/protected/ProtectRoute"
import AdminDashboardPage from "@/components/admin/AdminDashboardPage";

const AdminDashboard = () => {
  return (
    <ProtectRoute allowedRoles={['ADMIN']}>
      <>
      <AdminDashboardPage />
      </>
    </ProtectRoute>
  );
};

export default AdminDashboard;
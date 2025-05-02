import ProtectRoute from "@/app/protected/ProtectRoute"

const AdminDashboard = () => {
  return (
    <ProtectRoute allowedRoles={['admin']}>
      <>
        <h1>Welcome to the Admin Dashboard</h1>
        {/* Your Admin Dashboard content */}
      </>
    </ProtectRoute>
  );
};

export default AdminDashboard;
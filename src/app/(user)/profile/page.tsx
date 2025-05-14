import { SignOutButton } from '@clerk/nextjs';

const UserDashboard = () => {
  return (

      <div>
        <h1>Welcome to the User Dashboard</h1>
        <SignOutButton/>
        {/* Your User Dashboard content */}
      </div>
  );
};

export default UserDashboard;
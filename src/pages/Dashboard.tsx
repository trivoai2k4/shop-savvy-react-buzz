
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Hello, {user?.name || user?.email}!
              </p>
              <p className="text-gray-500 mb-8">
                This is a protected route that requires authentication.
              </p>
              <Button
                onClick={logout}
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { Navigate, Outlet } from 'react-router-dom';
import { useActiveUser } from '@/hooks/useActiveUser'; // Import useActiveUser
import Spinner from '@/components/Spinner';

interface ProtectedRouteProps {
  isClosed?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useActiveUser(); // Use the hook to get login status

  if (isLoading) {
    return <Spinner open />; // Show a loading indicator while checking auth
  }

  if (!isLoggedIn) {
    // If not logged in, redirect to login or show sign-in dialog
    // You might want to navigate to a dedicated login page instead of showing a dialog here
    // For now, let's redirect to the root or a login page.
    return <Navigate to="/" replace />;
  }

  // If logged in, render children or nested routes
  return children || <Outlet />;
}

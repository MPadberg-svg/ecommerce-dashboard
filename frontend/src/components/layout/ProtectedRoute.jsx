import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Updated import

export default function ProtectedRoute({ children, roles }) {
  // Removed isAuthenticated, kept user and loading
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="center-message">Loading session...</div>;
  }

  // Check if 'user' is null instead of checking isAuthenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
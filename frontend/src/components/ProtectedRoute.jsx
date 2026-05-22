import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'employer') return <Navigate to="/dashboard/employer" replace />;
    return <Navigate to="/dashboard/candidate" replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = true }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="container text-center animate-fade-in" style={{ padding: 'var(--space-16) 0' }}>
        <h2>Restricted Access</h2>
        <p>Whoops — that page is for the site owner only. Feel free to explore the public sections instead!</p>
        <button onClick={() => window.history.back()} className="button">
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
// components/PrivateRoute.jsx
// Wraps a page and only renders it if the user is logged in; otherwise redirects to /login

/*import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // While we're still checking localStorage on initial load, don't render anything yet
  // (prevents a flash of "redirecting to login" before we even know if the user is logged in)
  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // If no user is logged in, redirect to /login
  // "replace" means this redirect won't be added to browser history (so Back button doesn't loop)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in — render whatever page was wrapped
  return children;
};

export default PrivateRoute;*/
// components/PrivateRoute.jsx

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// adminOnly is an optional prop — defaults to false (just requires login)
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // NEW: if this route requires admin access and the user isn't one, redirect home
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
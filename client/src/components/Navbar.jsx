import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MERN Shop
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/products" className="text-gray-700 hover:text-blue-600">
          Products
        </Link>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-semibold">
                Admin
              </Link>
            )}
            <Link to="/wishlist" className="text-gray-700 hover:text-blue-600">
              Wishlist
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600">
              Cart
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">
              Orders
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
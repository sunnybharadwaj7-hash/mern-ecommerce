import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminProductForm from './pages/AdminProductForm';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1 className="text-center mt-20 text-2xl">Home Page</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute adminOnly><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/products/new" element={<PrivateRoute adminOnly><AdminProductForm /></PrivateRoute>} />
        <Route path="/admin/products/:id/edit" element={<PrivateRoute adminOnly><AdminProductEdit /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute adminOnly><AdminOrders /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
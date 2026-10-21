import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p className="text-center mt-20">Loading...</p>;

  const cards = [
    ['Users', stats.users],
    ['Products', stats.products],
    ['Orders', stats.orders],
    ['Revenue', `₹${stats.revenue}`],
  ];

  const links = [
    ['/admin/products', 'Manage Products'],
    ['/admin/products/new', 'Add Product'],
    ['/admin/users', 'Manage Users'],
    ['/admin/orders', 'Manage Orders'],
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-blue-600">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {links.map(([to, label]) => (
          <Link
            key={to}
            to={to}
            className="bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
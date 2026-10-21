import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my');
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md"
            >
              <div className="flex justify-between">
                <span className="font-semibold">Order #{order._id.slice(-6)}</span>
                <span className="font-bold text-blue-600">₹{order.totalPrice}</span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()} | Payment:{' '}
                {order.paymentStatus} | Status: {order.orderStatus}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
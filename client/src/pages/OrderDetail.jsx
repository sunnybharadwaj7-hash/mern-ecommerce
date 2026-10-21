import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order.');
      }
    };
    fetchOrder();
  }, [id]);

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-20">Loading...</p>;

  const a = order.shippingAddress;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Link to="/orders" className="text-blue-600 text-sm hover:underline">
        ← My Orders
      </Link>
      <h1 className="text-2xl font-bold mt-2">Order #{order._id.slice(-6)}</h1>
      <p className="text-sm text-gray-500">
        Payment: <b>{order.paymentStatus}</b> | Status: <b>{order.orderStatus}</b>
      </p>

      <div className="mt-6 space-y-3">
        {order.items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 bg-white p-3 rounded shadow">
            <div className="w-16 h-16 bg-gray-100 rounded">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                ₹{item.price} x {item.quantity}
              </p>
            </div>
            <p className="font-bold">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <p className="text-right text-xl font-bold mt-4">Total: ₹{order.totalPrice}</p>

      <div className="mt-6 bg-white p-4 rounded shadow text-sm">
        <h2 className="font-semibold mb-1">Shipping to</h2>
        <p>{a.fullName} ({a.phone})</p>
        <p>
          {a.address}, {a.city}, {a.state} - {a.pincode}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
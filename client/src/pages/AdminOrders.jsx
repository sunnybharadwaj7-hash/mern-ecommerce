import { useState, useEffect } from 'react';
import API from '../api/axios';

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/admin/orders').then(({ data }) => setOrders(data));
  }, []);

  const changeStatus = async (id, orderStatus) => {
    setError('');
    try {
      const { data } = await API.put(`/admin/orders/${id}/status`, { orderStatus });
      setOrders(orders.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3">#{o._id.slice(-6)}</td>
                <td className="p-3">
                  {o.user?.name || 'Deleted user'}
                  <br />
                  <span className="text-gray-400 text-xs">{o.user?.email}</span>
                </td>
                <td className="p-3">{o.items.length}</td>
                <td className="p-3">₹{o.totalPrice}</td>
                <td className="p-3">{o.paymentStatus}</td>
                <td className="p-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
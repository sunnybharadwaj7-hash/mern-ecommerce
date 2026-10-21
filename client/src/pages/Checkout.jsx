import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

// Loads Razorpay's checkout script once, on demand
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const { data } = await API.get('/cart');
      setCart(data);
    };
    fetchCart();
  }, []);

  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error('Could not load Razorpay. Check your internet.');

      // 1. Backend creates our order and a Razorpay order
      const { data } = await API.post('/orders', { shippingAddress: address });

      // 2. Open the Razorpay popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'MERN Shop',
        order_id: data.razorpayOrderId,
        prefill: { name: address.fullName, email: user.email, contact: address.phone },
        handler: async (response) => {
          // 3. Payment done, so backend verifies the signature
          try {
            const { data: order } = await API.post('/orders/verify', response);
            navigate(`/orders/${order._id}`);
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed.');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Checkout failed.');
      setLoading(false);
    }
  };

  const fields = [
    ['fullName', 'Full Name'],
    ['phone', 'Phone'],
    ['address', 'Address'],
    ['city', 'City'],
    ['state', 'State'],
    ['pincode', 'Pincode'],
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 grid md:grid-cols-2 gap-8">
      <form onSubmit={handlePay} className="space-y-4">
        <h1 className="text-2xl font-bold">Shipping Address</h1>

        {error && <p className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{error}</p>}

        {fields.map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              name={name}
              value={address[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading || cart.items.length === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay ₹${total}`}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-lg font-bold border-t pt-3">Total: ₹{total}</p>
      </div>
    </div>
  );
};

export default Checkout;
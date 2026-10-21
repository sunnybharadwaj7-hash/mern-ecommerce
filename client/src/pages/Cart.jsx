import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load cart once when page opens
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        setCart(data);
      } catch (err) {
        setError('Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Set quantity to an exact number (backend replaces the old value)
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await API.put(`/cart/${productId}`, { quantity });
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update quantity.');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data);
    } catch (err) {
      setError('Could not remove item.');
    }
  };

  // Total = sum of price x quantity for every item
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center mt-20">Loading cart...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cart.items.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                  {item.product.images?.length > 0 && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="font-semibold hover:text-blue-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-blue-600 font-bold">₹{item.product.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 border rounded disabled:opacity-40"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="px-2 border rounded disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: ₹{total}</p>
            <Link
              to="/checkout"
              className="inline-block mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
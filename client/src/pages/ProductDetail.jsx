import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await API.post('/cart', { productId: product._id, quantity: 1 });
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not add to cart.');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      await API.post('/wishlist', { productId: product._id });
      setMessage('Saved to wishlist!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save to wishlist.');
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Link to="/products" className="text-blue-600 hover:underline text-sm">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span>No Image Available</span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <p className="text-2xl font-bold text-blue-600 mt-4">₹{product.price}</p>

          <p
            className={`mt-2 text-sm font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          <p className="text-gray-700 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              ♡ Wishlist
            </button>
          </div>

          {message && (
            <p className="mt-3 text-sm text-green-600">
              {message}{' '}
              <Link to="/cart" className="underline">
                Cart
              </Link>{' '}
              |{' '}
              <Link to="/wishlist" className="underline">
                Wishlist
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
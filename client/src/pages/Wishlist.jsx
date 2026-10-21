import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await API.get('/wishlist');
        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    const { data } = await API.delete(`/wishlist/${productId}`);
    setProducts(data.products);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          Nothing saved yet.{' '}
          <Link to="/products" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product._id)}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
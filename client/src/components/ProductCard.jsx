// components/ProductCard.jsx
// Reusable card component to display a single product's summary info

import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white block"
    >
      {/* Placeholder image box — real images come once Cloudinary is wired up */}
      <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-lg font-bold text-blue-600 mt-1">₹{product.price}</p>
      <p className="text-xs text-gray-400 mt-1">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
    </Link>
  );
};

export default ProductCard;
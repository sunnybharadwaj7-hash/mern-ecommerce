import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/products', { params: { limit: 100 } }).then(({ data }) =>
      setProducts(data.products)
    );
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  <div className="w-12 h-12 bg-gray-100 rounded">
                    {p.images?.[0] && (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 space-x-3">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
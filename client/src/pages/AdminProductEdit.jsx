import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load the current values into the form
  useEffect(() => {
    API.get(`/products/${id}`).then(({ data }) =>
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
      })
    );
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.put(`/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className={inputClass} />
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Description" className={inputClass} />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" min="0" name="price" value={formData.price} onChange={handleChange} required placeholder="Price" className={inputClass} />
          <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} required placeholder="Stock" className={inputClass} />
        </div>
        <input name="category" value={formData.category} onChange={handleChange} required placeholder="Category" className={inputClass} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductEdit;
import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/admin/users').then(({ data }) => setUsers(data));
  }, []);

  const changeRole = async (id, role) => {
    setError('');
    try {
      const { data } = await API.put(`/admin/users/${id}/role`, { role });
      setUsers(users.map((u) => (u._id === id ? data : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change role.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:underline">
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

export default AdminUsers;
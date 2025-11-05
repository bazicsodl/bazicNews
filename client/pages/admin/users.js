import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://bazicnews.onrender.com/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const deleteUser = async (id) => {
    await fetch(`https://bazicnews.onrender.com/api/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} className="border p-2 mb-2 flex justify-between">
            <div>{user.name} ({user.email})</div>
            <div>
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600" onClick={() => deleteUser(user._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}

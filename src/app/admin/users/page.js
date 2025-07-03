'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/firebase';
import { UserCircle2 } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(query.toLowerCase()) ||
    user.email?.toLowerCase().includes(query.toLowerCase()) ||
    user.contactNumber?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserCircle2 size={24} />
        Manage Users
      </h1>

      <input
        type="text"
        placeholder="Search by name or email or phone..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded w-full max-w-md"
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto border rounded shadow-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.contactNumber || '-'}</td>
                  <td className="p-3 capitalize">{user.role || 'user'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;

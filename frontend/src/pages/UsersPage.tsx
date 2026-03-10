import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2 } from 'lucide-react';

interface User {
  id: number;
  email: string;
  role: string;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">User Directory</h1>
          <p className="text-slate-400 mt-1">Manage all registered platform users.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">{error}</div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading users...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">#{user.id}</td>
                  <td className="px-6 py-4 text-white">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/50 text-slate-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-red-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

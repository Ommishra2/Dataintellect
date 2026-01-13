'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Shield, User as UserIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  email: string;
}

import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
             setError("Access Denied: Admin Privileges Required.");
             setLoading(false);
             return;
        }

        if (!res.ok) throw new Error("Failed to load user directory");
        
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const handleDelete = async (userId: number) => {
      if(!confirm("Are you sure you want to delete this user?")) return;
      
      const token = localStorage.getItem('token');
      try {
          const res = await fetch(`http://127.0.0.1:8000/auth/users/${userId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!res.ok) throw new Error("Failed to delete user");
          
          // Refresh list
          setUsers(users.filter(u => u.id !== userId));
      } catch (err: any) {
          alert("Error deleting user: " + err.message);
      }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            User Directory
        </h1>
        <p className="text-slate-400 mt-2">
            Manage and view registered users. 
            <span className="ml-2 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
                Capacity: {users.length} / 50
            </span>
        </p>
      </div>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded border border-red-500/20">
            {error}
        </div>
      )}

      {loading ? (
          <div className="text-slate-500 italic">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
                <Card key={user.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-full">
                                <UserIcon className="h-6 w-6 text-slate-300" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-white">{user.email}</CardTitle>
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <Shield className="h-3 w-3 text-emerald-500" /> Authorized User
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDelete(user.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}

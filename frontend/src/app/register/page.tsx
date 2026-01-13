'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Registration failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-slate-200">
      <Card className="w-[350px] bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Create Account</CardTitle>
          <CardDescription className="text-slate-400">Join DataIntellect Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Create Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
            <div className="text-center text-xs text-slate-500 mt-4">
              Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

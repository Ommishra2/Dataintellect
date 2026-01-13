"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, LogOut, Mail } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{email: string | null, role: string | null}>({ email: null, role: null });

  useEffect(() => {
    // Decode token or just use localStorage if available?
    // For now, we don't have email in localStorage, only token/role.
    // We can fetch from backend /me endpoint if we had one, or decode the JWT.
    // For simplicity in this project, we'll try to fetch 'me' or just show role.
    
    // Better: Decoding JWT client-side or assume user knows their email.
    // Actually, let's fetch user details from a new endpoint or existing one.
    // Since we don't have a /me endpoint, let's parse the token "sub" if possible (frontend decoding might be complex without lib).
    // Let's simpler: Just show Role. And if Admin, show "Admin".
    
    const role = localStorage.getItem('role');
    // For email, strictly speaking we need to decode the token.
    // Let's implement a quick token parse or simply fetch from backend if we add /auth/me ? 
    // Wait, let's add /auth/me to backend ? No, let's just stick to what we have.
    // We can decode the standard JWT payload simply:
    
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.sub, role: role });
    } catch (e) {
        console.error("Invalid token");
    }

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 p-8 font-sans flex items-center justify-center">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-slate-800 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-slate-300" />
            </div>
            <CardTitle className="text-2xl text-white">My Account</CardTitle>
            <p className="text-slate-400 text-sm">Manage your profile settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
            
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase">Email Address</p>
                        <p className="text-sm font-medium text-white">{user.email || 'Loading...'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase">Account Role</p>
                        <p className="text-sm font-medium text-white capitalize">{user.role || 'User'}</p>
                    </div>
                </div>
            </div>

            <Button 
                onClick={handleLogout} 
                variant="destructive" 
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-6"
            >
                <LogOut className="h-5 w-5" /> Sign Out
            </Button>

            <div className="text-center">
                <Button variant="link" onClick={() => router.back()} className="text-slate-500">
                    &larr; Back to Application
                </Button>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}

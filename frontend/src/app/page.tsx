"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, Plus, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // State for Role & Admin Stats
  const [role, setRole] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // State for User Stats
  const [summary, setSummary] = useState<any>({});
  const [trends, setTrends] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check Auth & Role
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    
    if (!token) {
      router.push('/login');
      return;
    }
    setRole(savedRole);

    const headers = { 'Authorization': `Bearer ${token}` };

    // 2. Fetch Data based on Role
    const fetchAllData = async () => {
        try {
            if (savedRole === 'admin') {
                setAdminLoading(true);
                // Admin specific data
                 const res = await fetch('http://127.0.0.1:8000/auth/users', { headers });
                 if (res.ok) {
                    const users = await res.json();
                    setUserCount(users.length);
                 } else {
                    throw new Error("Failed to fetch admin data");
                 }
                 setAdminLoading(false);
            } else {
                setLoading(true);
                // User specific data
                const [summaryRes, trendsRes, recordsRes] = await Promise.all([
                  fetch('http://127.0.0.1:8000/dashboard/summary', { headers }),
                  fetch('http://127.0.0.1:8000/dashboard/trends', { headers }),
                  fetch('http://127.0.0.1:8000/dashboard/records?limit=1000', { headers })
                ]);
                
                if (summaryRes.status === 401 || trendsRes.status === 401) {
                    router.push('/login');
                    return;
                }
        
                if (!summaryRes.ok || !trendsRes.ok) throw new Error("Failed to fetch dashboard data");
        
                const summaryData = await summaryRes.json();
                const trendsData = await trendsRes.json();
                const recordsData = await recordsRes.json(); // returns { total, skip, limit, data: [...] }
        
                setSummary(summaryData);
                setTrends(trendsData);
                setTransactions(recordsData.data || []);
                setLoading(false);
            }
        } catch (err: any) {
            console.error(err);
            const msg = "Could not load data. Ensure backend is running.";
            if (savedRole === 'admin') setAdminError(msg);
            else setError(msg);
        } finally {
            setLoading(false);
            setAdminLoading(false);
        }
    };

    fetchAllData();
  }, [router]);

  // --- RENDER STATES ---

  // 1. Loading
  if ((role === 'admin' && adminLoading) || (role !== 'admin' && loading)) {
    return <div className="text-white text-center py-20 flex flex-col items-center gap-4">
        <Activity className="animate-spin h-8 w-8 text-blue-500" />
        <p>Loading AI Core...</p>
    </div>;
  }

  // 2. Error
  if ((role === 'admin' && adminError) || (role !== 'admin' && error)) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-xl text-red-500 flex gap-4 items-center max-w-2xl mx-auto mt-10">
        <AlertTriangle /> {role === 'admin' ? adminError : error}
      </div>
    );
  }

  // 3. ADMIN DASHBOARD
  if (role === 'admin') {
      return (
        <div className="p-6 space-y-8 min-h-screen bg-black text-slate-100 font-sans">
            <header>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 mt-2">System Overview & Management</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{userCount}</div>
                        <p className="text-xs text-blue-500 mt-1">Registered Accounts</p>
                    </CardContent>
                </Card>

                 <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">Active</div>
                        <p className="text-xs text-slate-500 mt-1">All systems operational</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold text-indigo-400 mb-2">Admin Controls</h2>
                    <p className="text-sm text-slate-400">
                        You have superuser privileges. Use the User Directory to manage access and remove users.
                    </p>
                </div>
                <Link href="/users">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Manage Users &rarr;
                    </Button>
                </Link>
            </div>
        </div>
      );
  }

  // 4. USER DASHBOARD
  return (
    <main className="font-mono min-h-screen max-w-[min(100vw,1600px)] mx-auto relative overflow-hidden flex flex-col px-6 pt-12 md:pt-16 bg-background text-foreground">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            DataIntellect
          </h1>
          <p className="text-slate-400 text-sm">Financial Risk Intelligence Platform</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Analysis
          </Button>
        </div>
      </header>

      {/* The Analytics Dashboard Component */}
      <AnalyticsDashboard 
        summaryMetrics={summary} 
        trendMetrics={trends} 
        recentTransactions={transactions} 
      />
    </main>
  );
}

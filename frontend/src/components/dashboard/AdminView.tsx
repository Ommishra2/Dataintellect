import { Link } from 'react-router-dom';
import { Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminViewProps {
  userCount: number;
}

export function AdminView({ userCount }: AdminViewProps) {
  return (
    <div className="p-6 space-y-8 min-h-screen bg-black text-slate-100 font-sans">
      <header>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">System Overview & Management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userCount}</div>
            <p className="text-xs text-blue-500 mt-1">Registered Accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
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

      <div className="bg-black border border-gray-800 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Controls</h2>
          <p className="text-sm text-gray-400">
            You have superuser privileges. Use the User Directory to manage access and remove users.
          </p>
        </div>
        <Link to="/users">
          <Button className="bg-white hover:bg-gray-200 text-black border border-gray-200">
            Manage Users &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}

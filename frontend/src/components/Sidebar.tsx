"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, UploadCloud, BarChart3, Settings, ShieldCheck, Users, LogOut, User, ChevronUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Upload Data', href: '/upload', icon: UploadCloud },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const [role, setRole] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>('User');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  React.useEffect(() => {
    setRole(localStorage.getItem('role'));
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setEmail(payload.sub); 
        } catch(e) {}
    }
  }, []);

  if (role === 'admin') {
     // Prevent duplicate User Directory if re-rendering (simple check)
     const hasUsers = navItems.find(i => i.href === '/users');
     if (!hasUsers) {
         navItems.splice(3, 0, { name: 'User Directory', href: '/users', icon: Users });
     }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 font-sans z-50">
      <div className="p-6 flex items-center gap-2 border-b border-slate-800">
        <ShieldCheck className="h-8 w-8 text-blue-500" />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          DataIntellect
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 relative">
        <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {email[0].toUpperCase()}
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-white truncate w-28">{email}</p>
                    <p className="text-xs text-slate-400 capitalize">{role || 'User'}</p>
                </div>
            </div>
            <ChevronUp className={`h-4 w-4 text-slate-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <Link 
                    href="/account" 
                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <User className="h-4 w-4" /> Account Profile
                </Link>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-slate-800"
                >
                    <LogOut className="h-4 w-4" /> Sign Out
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

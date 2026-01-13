"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClearData = async () => {
    if (!confirm("ARE YOU SURE? This will permanently delete ALL uploaded financial records. This action cannot be undone.")) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    setIsLoading(true);
    setSuccess(null);
    setError(null);

    try {
        const response = await fetch('http://127.0.0.1:8000/settings/clear-data', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to clear data");
        
        setSuccess("Database successfully wiped. You can upload new data now.");
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your data and application preferences.</p>
      </div>

      {success && (
          <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl text-green-500 flex gap-3 items-center">
              <CheckCircle className="h-5 w-5" /> {success}
          </div>
      )}

      {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 flex gap-3 items-center">
              <AlertTriangle className="h-5 w-5" /> {error}
          </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-start gap-4">
               <div className="bg-red-500/10 p-3 rounded-xl">
                   <Database className="h-6 w-6 text-red-500" />
               </div>
               <div className="flex-1">
                   <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
                   <p className="text-slate-400 text-sm mt-1">
                       Permanently remove all imported financial records from the PostgreSQL database. 
                       This is useful for resetting the demo environment.
                   </p>
                   
                   <button 
                       onClick={handleClearData}
                       disabled={isLoading}
                       className={`mt-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                   >
                       {isLoading ? (
                           "Clearing..."
                       ) : (
                           <>
                               <Trash2 className="h-4 w-4" /> Clear All Financial Data
                           </>
                       )}
                   </button>
               </div>
          </div>
      </div>
    </div>
  );
}

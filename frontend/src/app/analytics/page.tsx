"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const LIMIT = 50;

// extracted hook
function useAnalyticsData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (skip: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Simple client-side redirect if no token (though ideally handled by router in component)
        window.location.href = '/login'; 
        return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/dashboard/records?skip=${skip}&limit=${LIMIT}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
         window.location.href = '/login';
         return;
      }

      if (!res.ok) throw new Error("Failed to fetch records");
      const result = await res.json();
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page * LIMIT);
  }, [page, fetchData]);

  const nextPage = () => {
    if ((page + 1) * LIMIT < total) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(p => p - 1);
  };

  return { data, loading, error, page, total, nextPage, prevPage };
}

// extracted component
function RecordsTable({ data, loading }: { data: any[], loading: boolean }) {
  if (loading) {
     return (
        <tr>
            <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                Loading data...
            </td>
        </tr>
     );
  }
  
  if (data.length === 0) {
      return (
        <tr>
            <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                No records found. Upload a CSV to get started.
            </td>
        </tr>
      );
  }

  return (
    <>
      {data.map((row) => (
        <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-4 font-mono text-slate-300">{row.account_id}</td>
            <td className="px-6 py-4">{row.date}</td>
            <td className="px-6 py-4 text-green-400">${row.revenue.toLocaleString()}</td>
            <td className="px-6 py-4 text-red-400">${row.expense.toLocaleString()}</td>
            <td className="px-6 py-4 font-medium text-white">${row.balance.toLocaleString()}</td>
            <td className="px-6 py-4 text-slate-400">{row.transaction_count}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.overdue_amount > 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                    {row.overdue_amount > 0 ? `Overdue (${row.payment_delay_days}d)` : "Good Standing"}
                </span>
            </td>
        </tr>
      ))}
    </>
  );
}

// extracted component
function Pagination({ page, total, onNext, onPrev }: { page: number, total: number, onNext: () => void, onPrev: () => void }) {
    return (
        <div className="bg-slate-950 p-4 flex items-center justify-between border-t border-slate-800">
             <span className="text-sm text-slate-500">
                 Showing {page * LIMIT + 1}-{Math.min((page + 1) * LIMIT, total)} of {total}
             </span>
             <div className="flex gap-2">
                 <button 
                    onClick={onPrev} 
                    disabled={page === 0}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                     <ChevronLeft className="h-5 w-5" />
                 </button>
                 <button 
                    onClick={onNext} 
                    disabled={(page + 1) * LIMIT >= total}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                     <ChevronRight className="h-5 w-5" />
                 </button>
             </div>
        </div>
    );
}

export default function AnalyticsPage() {
  const { data, loading, error, page, total, nextPage, prevPage } = useAnalyticsData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Data Analysis</h1>
          <p className="text-slate-400 mt-2">Detailed view of all uploaded financial records.</p>
        </div>
        <div className="flex gap-4">
             <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300 border border-slate-700">
                Total Records: <span className="text-white font-bold">{total}</span>
             </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl text-red-500 flex gap-2 items-center">
            <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Account ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Expense</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Trans. Count</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
               <RecordsTable data={data} loading={loading} />
            </tbody>
          </table>
        </div>
        
        <Pagination page={page} total={total} onNext={nextPage} onPrev={prevPage} />
      </div>
    </div>
  );
}

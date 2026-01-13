"use client";
import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  
  const router = useRouter(); // Ensure router is available or allow window redirect

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };
  
  // Check auth
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    if (!token) {
        // window.location check or router push if available
        return; 
    }

    try {
        // Note: In production, use an environment variable for the API URL
      const response = await fetch('http://127.0.0.1:8000/upload/financial-data', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Content-Type is automatic with FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Financial Data</h1>
        <p className="text-slate-400 mt-2">Upload your financial records (CSV) for analysis.</p>
      </div>

      {/* Upload Box */}
      <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors">
        <div className="bg-slate-800 p-4 rounded-full mb-4">
          <UploadCloud className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {file ? file.name : "Click to upload or drag and drop"}
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          CSV files only (max 10MB)
        </p>
        
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="hidden" 
          id="file-upload"
        />
        
        <label 
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Select File
        </label>

        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-4 w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Processing...' : 'Upload & Analyze'}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Results Preview */}
      {data && data.summary && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Upload Successful
                </h3>
                <div className="text-sm text-slate-400">
                    {data.rows_inserted} transactions inserted
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Account ID</th>
                             <th className="px-6 py-4">Avg Revenue</th>
                              <th className="px-6 py-4">Avg Expense</th>
                               <th className="px-6 py-4">Total Overdue</th>
                                <th className="px-6 py-4">Avg Delay (Days)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.summary.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-800/50">
                                <td className="px-6 py-4">{row.account_id}</td>
                                <td className="px-6 py-4 text-green-400">${row.avg_revenue.toFixed(2)}</td>
                                <td className="px-6 py-4 text-red-400">${row.avg_expense.toFixed(2)}</td>
                                 <td className="px-6 py-4 font-medium text-amber-500">${row.total_overdue.toFixed(2)}</td>
                                  <td className="px-6 py-4">{row.avg_delay.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}

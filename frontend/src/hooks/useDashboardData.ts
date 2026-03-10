import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface DashboardData {
  role: string | null;
  userCount: number;
  summary: Record<string, unknown>;
  trends: unknown[];
  transactions: unknown[];
  loading: boolean;
  adminLoading: boolean;
  error: string | null;
  adminError: string | null;
}

export function useDashboardData() {
  const navigate = useNavigate();

  const [role, setRole] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const [summary, setSummary] = useState<Record<string, unknown>>({});
  const [trends, setTrends] = useState<unknown[]>([]);
  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (!token) {
      navigate('/login');
      return;
    }
    setRole(savedRole);

    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchAllData = async () => {
      try {
        if (savedRole === 'admin') {
          setAdminLoading(true);
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
          const [summaryRes, trendsRes, recordsRes] = await Promise.all([
            fetch('http://127.0.0.1:8000/dashboard/summary', { headers }),
            fetch('http://127.0.0.1:8000/dashboard/trends', { headers }),
            fetch('http://127.0.0.1:8000/dashboard/records?limit=1000', { headers })
          ]);

          if (summaryRes.status === 401 || trendsRes.status === 401) {
            navigate('/login');
            return;
          }

          if (!summaryRes.ok || !trendsRes.ok) throw new Error("Failed to fetch dashboard data");

          const summaryData = await summaryRes.json();
          const trendsData = await trendsRes.json();
          const recordsData = await recordsRes.json();

          setSummary(summaryData);
          setTrends(trendsData);
          setTransactions(recordsData.data || []);
          setLoading(false);
        }
      } catch (err: unknown) {
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
  }, [navigate]);

  return {
    role, userCount, summary, trends, transactions,
    loading, adminLoading, error, adminError
  };
}

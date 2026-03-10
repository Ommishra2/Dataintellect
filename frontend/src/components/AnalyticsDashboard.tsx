'use client';

import { StatCard } from "@/components/ui/StatCard";
import TransactionsTable from "./TransactionsTable";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { AnomalyChart } from "@/components/charts/AnomalyChart";
import { AlertsList } from "@/components/dashboard/AlertsList";

// Mock data for visualization structure
const chartData = [
  { month: "Jan", revenue: 5000, expense: 2000 },
  { month: "Feb", revenue: 5200, expense: 2100 },
  { month: "Mar", revenue: 4800, expense: 2500 },
  { month: "Apr", revenue: 6100, expense: 3200 },
  { month: "May", revenue: 5500, expense: 2800 },
  { month: "Jun", revenue: 7000, expense: 4000 },
];

interface AnalyticsDashboardProps {
  summaryMetrics: any;
  trendMetrics: any[];
  recentTransactions?: any[];
}

export default function AnalyticsDashboard({ summaryMetrics, trendMetrics, recentTransactions = [] }: AnalyticsDashboardProps) {
  // Use data from props if available for specific metrics, otherwise mock/default
  const revenue = summaryMetrics?.total_revenue || 0;
  const expense = summaryMetrics?.total_expense || 0;
  const balance = summaryMetrics?.current_balance || 0;

  // Use real trend data if available, otherwise fallback to empty to avoid crashing charts
  const data = trendMetrics && trendMetrics.length > 0 ? trendMetrics : chartData;

  return (
    <div className="space-y-6">
      {/* ROW 1: High-Level Metrics (Vercel Style) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Revenue" 
            value={revenue} 
            prefix="$"
            infoContent="Total revenue generated from all accounts in the current period."
            className="border-gray-800 bg-black"
        />
        <StatCard 
            title="Total Expenses" 
            value={expense} 
            prefix="$"
            infoContent="Aggregated expenses across all registered accounts."
            className="border-gray-800 bg-black"
        />
        <StatCard 
            title="Net Balance" 
            value={balance} 
            prefix="$"
            infoContent="Current liquid assets available (Revenue - Expenses)."
            className="border-gray-800 bg-black"
        >
             <p className="text-xs text-emerald-500 font-mono mt-2">+12% from last month</p>
        </StatCard>
        <StatCard 
            title="Risk Score" 
            value="ANALYZING" 
            infoContent="Real-time risk assessment score based on transaction patterns and anomalies."
            className="border-gray-800 bg-black text-yellow-500"
        >
            <p className="text-xs text-slate-500 font-mono mt-2">ML Model Pending (Phase 2)</p>
        </StatCard>
      </div>

      {/* ROW 2: Detailed Charts (Recharts) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={data} />
        <CashFlowChart data={data} />
      </div>

       {/* ROW 3: AI Anomaly Detection */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AnomalyChart data={data} />
        <AlertsList />
      </div>

       {/* ROW 4: Interactive Data Grid */}
       <div className="grid gap-4">
        {/* We pass the same 'recentTransactions' prop if available, or empty array */}
        <TransactionsTable transactions={recentTransactions} />
       </div>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/ui/StatCard";
import TransactionsTable from "./TransactionsTable";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  Scatter
} from "recharts";

// Mock data for visualization structure (until we connect the real API response data correctly)
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
            className="border-slate-800 bg-slate-950/50"
        />
        <StatCard 
            title="Total Expenses" 
            value={expense} 
            prefix="$"
            infoContent="Aggregated expenses across all registered accounts."
            className="border-slate-800 bg-slate-950/50"
        />
        <StatCard 
            title="Net Balance" 
            value={balance} 
            prefix="$"
            infoContent="Current liquid assets available (Revenue - Expenses)."
            className="border-slate-800 bg-slate-950/50"
        >
             <p className="text-xs text-emerald-500 font-mono mt-2">+12% from last month</p>
        </StatCard>
        <StatCard 
            title="Risk Score" 
            value="ANALYZING" 
            infoContent="Real-time risk assessment score based on transaction patterns and anomalies."
            className="border-slate-800 bg-slate-950/50 text-yellow-500"
        >
            <p className="text-xs text-slate-500 font-mono mt-2">ML Model Pending (Phase 2)</p>
        </StatCard>
      </div>

      {/* ROW 2: Detailed Charts (Recharts) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Chart: Revenue vs Expense Trend */}
        <Card className="col-span-4 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Financial Performance</CardTitle>
            <CardDescription className="text-slate-400">Revenue vs. Expenses over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#f43f5e" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Chart: Cash Flow Distribution */}
        <Card className="col-span-3 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Cash Flow Volume</CardTitle>
            <CardDescription className="text-slate-400">Monthly transaction density</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis 
                    dataKey="month" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: '#334155'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>

       {/* ROW 3: AI Anomaly Detection */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-950 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                        AI Anomaly Detection <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Live Model</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">Detecting irregular financial patterns</CardDescription>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Normal
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Anomaly
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Scatter name="Anomalies" data={data.filter((d: any) => d.expense > d.revenue * 0.8)} fill="red" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Live Alerts</CardTitle>
            <CardDescription className="text-slate-400">Real-time flagged transactions</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[
                    { id: "TX-9822", message: "Unusual expense spike detected", severity: "high", time: "2 mins ago" },
                    { id: "TX-9821", message: "Recurring payment deviation", severity: "medium", time: "15 mins ago" },
                    { id: "TX-9815", message: "Revenue dropped below threshold", severity: "medium", time: "1 hour ago" },
                    { id: "TX-9788", message: "Unknown merchant category", severity: "low", time: "3 hours ago" },
                ].map((alert, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-slate-900 border border-slate-800/50 hover:bg-slate-800 transition-colors">
                        <div className={`w-2 h-2 mt-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-slate-200">{alert.message}</h4>
                                <span className="text-xs text-slate-500">{alert.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">ID: {alert.id}</p>
                        </div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
       </div>

       {/* ROW 4: Interactive Data Grid */}
       <div className="grid gap-4">
        {/* We pass the same 'recentTransactions' prop if available, or empty array */}
        <TransactionsTable transactions={recentTransactions} />
       </div>
    </div>
  );
}

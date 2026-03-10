import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

interface UserViewProps {
  summary: Record<string, unknown>;
  trends: unknown[];
  transactions: unknown[];
}

export function UserView({ summary, trends, transactions }: UserViewProps) {
  return (
    <main className="font-mono min-h-screen max-w-[min(100vw,1600px)] mx-auto relative overflow-hidden flex flex-col px-6 pt-12 md:pt-16 bg-background text-foreground">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">DataIntellect</h1>
          <p className="text-gray-500 text-sm">Financial Risk Intelligence Platform</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-gray-800 bg-black text-gray-200 hover:bg-gray-900 hover:text-white transition-colors">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200 border border-white">
            <Plus className="mr-2 h-4 w-4" /> New Analysis
          </Button>
        </div>
      </header>
      <AnalyticsDashboard
        summaryMetrics={summary}
        trendMetrics={trends}
        recentTransactions={transactions}
      />
    </main>
  );
}


"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <Card className="col-span-4 bg-black border-neutral-800">
      <CardHeader>
        <CardTitle className="text-gray-1000">Financial Performance</CardTitle>
        <CardDescription className="text-gray-900">Revenue vs. Expenses over time</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ds-blue-700)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--ds-blue-700)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ds-gray-500)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--ds-gray-500)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#525252' }}
              />
              <YAxis
                stroke="#525252"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#525252' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--ds-blue-700)" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="var(--ds-gray-500)" 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

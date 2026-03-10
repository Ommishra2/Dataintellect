
"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function CashFlowChart({ data }: { data: any[] }) {
  return (
    <Card className="col-span-3 bg-black border-neutral-800">
      <CardHeader>
        <CardTitle className="text-gray-1000">Cash Flow Volume</CardTitle>
        <CardDescription className="text-gray-900">Monthly transaction density</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="month" 
                stroke="#525252" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#525252' }}
              />
              <Tooltip 
                cursor={{fill: '#262626'}}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
              />
              <Bar dataKey="revenue" fill="var(--ds-blue-800)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
         </div>
      </CardContent>
    </Card>
  );
}

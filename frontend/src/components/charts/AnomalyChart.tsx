
"use client";

import { 
  ComposedChart, 
  Line, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function AnomalyChart({ data }: { data: any[] }) {
  return (
    <Card className="col-span-4 bg-black border-neutral-800">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-gray-1000 flex items-center gap-2">
                    AI Anomaly Detection <span className="text-xs bg-gray-100 text-black px-2 py-0.5 rounded-full font-mono border border-gray-200">Live Model</span>
                </CardTitle>
                <CardDescription className="text-gray-900">Detecting irregular financial patterns</CardDescription>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div> Normal
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> Anomaly
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#525252' }} />
              <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#525252' }} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--ds-blue-600)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#525252" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Scatter name="Anomalies" data={data.filter((d: any) => d.expense > d.revenue * 0.8)} fill="#fff" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

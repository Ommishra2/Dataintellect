import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function AlertsList() {
  return (
    <Card className="col-span-3 bg-black border-neutral-800">
      <CardHeader>
        <CardTitle className="text-gray-1000">Live Alerts</CardTitle>
        <CardDescription className="text-gray-900">Real-time flagged transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { id: "TX-9822", message: "Unusual expense spike detected", severity: "high", time: "2 mins ago" },
            { id: "TX-9821", message: "Recurring payment deviation", severity: "medium", time: "15 mins ago" },
            { id: "TX-9815", message: "Revenue dropped below threshold", severity: "medium", time: "1 hour ago" },
            { id: "TX-9788", message: "Unknown merchant category", severity: "low", time: "3 hours ago" },
          ].map((alert, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-black border border-gray-800 hover:border-gray-700 transition-colors">
              <div className={`w-2 h-2 mt-2 rounded-full ${alert.severity === 'high' ? 'bg-white' : alert.severity === 'medium' ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-100">{alert.message}</h4>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-mono">ID: {alert.id}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

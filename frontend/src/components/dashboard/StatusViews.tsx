import { AlertTriangle } from 'lucide-react';

export function LoadingView() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

interface ErrorViewProps {
  error: string;
}

export function ErrorView({ error }: ErrorViewProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <div className="text-red-400 text-xl">{error}</div>
        <p className="text-gray-500">Please verify your backend is running on port 8000</p>
      </div>
    </div>
  );
}

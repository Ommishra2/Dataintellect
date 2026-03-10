import { useDashboardData } from '@/hooks/useDashboardData';
import { AdminView } from '@/components/dashboard/AdminView';
import { UserView } from '@/components/dashboard/UserView';
import { LoadingView, ErrorView } from '@/components/dashboard/StatusViews';

export default function DashboardPage() {
  const {
    role, userCount, summary, trends, transactions,
    loading, adminLoading, error, adminError
  } = useDashboardData();

  const isAdmin = role === 'admin';
  const isLoading = isAdmin ? adminLoading : loading;
  const errorMessage = isAdmin ? adminError : error;

  if (isLoading) return <LoadingView />;
  if (errorMessage) return <ErrorView error={errorMessage} />;
  if (isAdmin) return <AdminView userCount={userCount} />;

  return (
    <UserView
      summary={summary}
      trends={trends}
      transactions={transactions}
    />
  );
}

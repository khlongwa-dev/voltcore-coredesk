import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <AppLayout title="Dashboard">
      <p className="text-sm text-muted">
        Signed in as <span className="font-semibold text-ink">{user?.full_name}</span> — {user?.role}
      </p>
    </AppLayout>
  );
}
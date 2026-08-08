import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-sans">
      <div className="text-center">
        <p className="text-ink font-semibold">Logged in as {user?.full_name} ({user?.role})</p>
        <button onClick={logout} className="mt-4 text-sm text-navy underline">Log out</button>
      </div>
    </div>
  );
}
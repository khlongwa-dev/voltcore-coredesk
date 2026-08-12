import { useMemo } from 'react';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/ui/Card';
import TicketCard from '../components/features/TicketCard';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';

function Stat({ num, label, alert }) {
  return (
    <Card className={`p-4 ${alert ? 'border-l-4 border-l-orange' : ''}`}>
      <div className={`font-mono text-2xl font-semibold ${alert ? 'text-orange' : 'text-navy'}`}>{num}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </Card>
  );
}

function EmployeeDashboard() {
  const { data: tickets, isLoading } = useTickets();

  const stats = useMemo(() => {
    if (!tickets) return { open: 0, inProgress: 0, resolved: 0 };
    return {
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in_progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    };
  }, [tickets]);

  if (isLoading) return <p className="text-sm text-muted">Loading…</p>;

  const recent = [...(tickets || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Stat num={stats.open} label="Open tickets" />
        <Stat num={stats.inProgress} label="In progress" />
        <Stat num={stats.resolved} label="Resolved" />
      </div>
      <div>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Recent Tickets</h2>
        <div className="space-y-2.5">
          {recent.length ? recent.map((t) => <TicketCard key={t.id} ticket={t} />)
            : <p className="text-sm text-muted">No tickets yet.</p>}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { data: tickets, isLoading: ticketsLoading } = useTickets();
  const { data: users, isLoading: usersLoading } = useUsers();

  const stats = useMemo(() => {
    if (!tickets || !users) return null;

    const open = tickets.filter((t) => ['open', 'in_progress'].includes(t.status)).length;
    const criticalUnassigned = tickets.filter((t) => t.priority === 'critical' && !t.assigned_to).length;
    const activeAgents = users.filter((u) => u.role === 'agent' && u.is_active).length;

    const resolved = tickets.filter((t) => t.resolved_at);
    const avgResolutionDays = resolved.length
      ? (
          resolved.reduce((sum, t) => {
            const hours = (new Date(t.resolved_at) - new Date(t.created_at)) / 36e5;
            return sum + hours;
          }, 0) / resolved.length / 24
        ).toFixed(1)
      : '—';

    return { open, criticalUnassigned, activeAgents, avgResolutionDays };
  }, [tickets, users]);

  if (ticketsLoading || usersLoading || !stats) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Stat num={stats.open} label="Open tickets, all offices" />
      <Stat num={stats.criticalUnassigned} label="Critical & unassigned" alert={stats.criticalUnassigned > 0} />
      <Stat num={stats.activeAgents} label="Active agents" />
      <Stat num={`${stats.avgResolutionDays}d`} label="Avg. resolution time" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const title = user?.role === 'admin' ? 'Admin Overview' : 'My Dashboard';

  return (
    <AppLayout title={title}>
      {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </AppLayout>
  );
}
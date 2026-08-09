import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../hooks/useTickets';
import TicketCard from '../components/features/TicketCard';
import TicketTable from '../components/features/TicketTable';

const OFFICES = [
  { value: '', label: 'All Offices' },
  { value: 'durban', label: 'Durban' },
  { value: 'johannesburg', label: 'Johannesburg' },
];

export default function TicketList() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const office = searchParams.get('office') || '';
  const assignedToMe = searchParams.get('assigned_to_me') === 'true';
  const status = searchParams.get('status') || '';

  const { data: tickets, isLoading, error } = useTickets({ office, assignedToMe, status });

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  if (isLoading) return <p className="text-sm text-muted">Loading tickets…</p>;
  if (error) return <p className="text-sm text-danger">Could not load tickets.</p>;
  if (!tickets?.length) return <p className="text-sm text-muted">No tickets found.</p>;

  const isEmployee = user?.role === 'employee';

  return (
    <div className="space-y-4">
      {!isEmployee && (
        <div className="flex gap-2 flex-wrap text-sm">
          {OFFICES.map((o) => (
            <button
              key={o.value}
              onClick={() => updateParam('office', o.value)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
                office === o.value ? 'bg-navy text-white border-navy' : 'bg-white text-muted border-border'
              }`}
            >
              {o.label}
            </button>
          ))}
          <button
            onClick={() => updateParam('assigned_to_me', assignedToMe ? '' : 'true')}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
              assignedToMe ? 'bg-navy text-white border-navy' : 'bg-white text-muted border-border'
            }`}
          >
            Assigned to me
          </button>
          <select
            value={status}
            onChange={(e) => updateParam('status', e.target.value)}
            className="px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-muted bg-white"
          >
            <option value="">Any status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      {isEmployee ? (
        <div className="space-y-2.5">
          {tickets.map((t) => <TicketCard key={t.id} ticket={t} />)}
        </div>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </div>
  );
}
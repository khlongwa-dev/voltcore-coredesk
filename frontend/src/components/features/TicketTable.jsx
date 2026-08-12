import { Link } from 'react-router-dom';
import PriorityTag from '../ui/PriorityTag';
import StatusPill from '../ui/StatusPill';
import Button from '../ui/Button';
import { canAssignTickets } from '../../permissions';
import { useAuth } from '../../context/AuthContext';
import { useAssignTicket } from '../../hooks/useTickets';

export default function TicketTable({ tickets }) {
  const { user } = useAuth();
  const assignTicket = useAssignTicket();

  return (
    <table className="w-full bg-white border border-border rounded-lg overflow-hidden text-sm">
      <thead>
        <tr className="bg-surface border-b border-border text-left text-xs uppercase tracking-wide text-muted">
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Ticket</th>
          <th className="px-4 py-3">Priority</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Office</th>
          <th className="px-4 py-3">Assigned</th>
          <th className="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="border-b border-border last:border-0">
            <td className="px-4 py-3 font-mono text-muted text-xs">#{String(ticket.id).padStart(4, '0')}</td>
            <td className="px-4 py-3">
              <div className="font-semibold">{ticket.title}</div>
              <div className="text-xs text-muted capitalize">{ticket.category}</div>
            </td>
            <td className="px-4 py-3"><PriorityTag priority={ticket.priority} /></td>
            <td className="px-4 py-3"><StatusPill status={ticket.status} /></td>
            <td className="px-4 py-3 capitalize">{ticket.office}</td>
            <td className="px-4 py-3">
              {ticket.assignee ? (
                <span className="text-xs">{ticket.assignee.full_name}</span>
              ) : (
                <span className="text-xs text-muted italic">Unassigned</span>
              )}
            </td>
            <td className="px-4 py-3 space-x-3 whitespace-nowrap">
              <Link to={`/tickets/${ticket.id}`} className="text-xs font-semibold text-navy">Open</Link>
              {canAssignTickets(user) && !ticket.assigned_to && (
                <button
                  onClick={() => assignTicket.mutate({ ticketId: ticket.id, assignedTo: user.id })}
                  disabled={assignTicket.isPending}
                  className="text-xs font-semibold text-orange border border-orange/30 rounded-md px-3 py-1.5 transition-colors hover:bg-orange hover:text-white hover:border-orange disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assignTicket.isPending ? 'Assigning...' : 'Assign to me'}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
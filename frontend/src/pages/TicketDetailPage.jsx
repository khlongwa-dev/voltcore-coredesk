import { useParams } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useTicket, useAssignTicket, useUpdateTicketStatus } from '../hooks/useTickets';
import { canAssignTickets, canEditTicketDetails } from '../permissions';
import StatusPill from '../components/ui/StatusPill';
import PriorityTag from '../components/ui/PriorityTag';
import Button from '../components/ui/Button';
import CommentThread from '../components/features/CommentThread';

const STATUS_FLOW = ['open', 'in_progress', 'resolved', 'closed'];

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: ticket, isLoading, error } = useTicket(id);
  const assignTicket = useAssignTicket();
  const updateStatus = useUpdateTicketStatus();

  if (isLoading) return <AppLayout title="Ticket"><p className="text-sm text-muted">Loading…</p></AppLayout>;
  if (error || !ticket) return <AppLayout title="Ticket"><p className="text-sm text-danger">Ticket not found.</p></AppLayout>;

  const canManage = canEditTicketDetails(user);

  return (
    <AppLayout title={`#${String(ticket.id).padStart(4, '0')} — ${ticket.title}`}>
      <div className="grid grid-cols-[1fr_280px] gap-6 max-w-4xl">
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <StatusPill status={ticket.status} />
              <PriorityTag priority={ticket.priority} />
              <span className="text-xs text-muted capitalize">{ticket.category} · {ticket.office}</span>
            </div>
            <p className="text-sm text-ink whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="bg-white border border-border rounded-lg p-5">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Comments</h2>
            <CommentThread ticketId={ticket.id} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Assigned to</h3>
            {ticket.assignee ? (
              <p className="text-sm font-medium">{ticket.assignee.full_name}</p>
            ) : (
              <p className="text-sm text-muted italic mb-2">Unassigned</p>
            )}
            {canAssignTickets(user) && !ticket.assigned_to && (
              <Button
                variant="secondary"
                className="mt-2 w-full"
                onClick={() => assignTicket.mutate({ ticketId: ticket.id, assignedTo: user.id })}
              >
                Assign to me
              </Button>
            )}
          </div>

          {canManage && (
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Change Status</h3>
              <div className="flex flex-col gap-2">
                {STATUS_FLOW.map((s) => (
                  <Button
                    key={s}
                    variant={s === ticket.status ? 'secondary' : 'ghost'}
                    disabled={s === ticket.status || updateStatus.isPending}
                    className="capitalize"
                    onClick={() => updateStatus.mutate({ ticketId: ticket.id, newStatus: s })}
                  >
                    {s.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
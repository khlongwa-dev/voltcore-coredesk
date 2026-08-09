import { Link } from "react-router-dom";
import Card from '../ui/Card';
import StatusPill from '../ui/StatusPill';

export default function TicketCard({ ticket }) {
    return <Link to={`/tickets/${ticket.id}`}>
        <Card priority={ticket.priority} className="p-4 flex items-center gap-4 hover:border-navy/30">
            <div className="font-mono text-xs text-muted w-16 shrink-0">#{String(ticket.id).padStart(4, '0')}</div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{ticket.title}</div>
                <div className="text-xs text-muted mt-0.5 capitalize">{ticket.category} · Opened {new Date(ticket.created_at).toLocaleDateString()}</div>
            </div>
            <StatusPill status={ticket.status} />
        </Card>
    </Link>
}
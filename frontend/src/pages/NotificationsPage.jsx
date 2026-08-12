import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { useNotifications, useMarkNotificationRead } from '../hooks/useNotifications';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <AppLayout title="Notifications">
      {isLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : notifications?.length ? (
        <div className="max-w-2xl space-y-2">
          {notifications.map((n) => (
            <Link
              key={n.id}
              to={`/tickets/${n.ticket_id}`}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={`block border rounded-lg px-4 py-3 text-sm hover:border-navy/30 ${
                !n.is_read ? 'bg-orange/5 border-orange/30' : 'bg-white border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-ink">{n.message}</p>
                {!n.is_read && <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0 ml-3" />}
              </div>
              <p className="text-[11px] text-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No notifications.</p>
      )}
    </AppLayout>
  );
}
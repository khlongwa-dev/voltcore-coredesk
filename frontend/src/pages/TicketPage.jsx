import AppLayout from '../layouts/AppLayout';
import TicketList from '../containers/TicketList';
import { useAuth } from '../context/AuthContext';

export default function TicketsPage() {
  const { user } = useAuth();
  const title = user?.role === 'employee' ? 'My Tickets' : 'Ticket Queue';

  return (
    <AppLayout title={title}>
      <TicketList />
    </AppLayout>
  );
}
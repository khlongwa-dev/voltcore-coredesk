import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import TicketsPage from './pages/TicketPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminUsersPage from './pages/AdminUserPage';
import NotificationsPage from './pages/NotificationsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute skipPasswordCheck>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
      <Route path="/tickets/new" element={<ProtectedRoute><NewTicketPage /></ProtectedRoute>} />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
      <Route path='/users' element={ <ProtectedRoute allowedRoles={['admin']}>
        <AdminUsersPage />
      </ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
    </Routes>
  );
}
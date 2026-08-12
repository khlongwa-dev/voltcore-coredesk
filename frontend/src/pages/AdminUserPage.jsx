import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useUsers, useDeactivateUser, useReactivateUser, useChangeUserRole } from '../hooks/useUsers';

const ROLES = ['employee', 'agent', 'admin'];

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const { data: users, isLoading, error } = useUsers();
    const deactivate = useDeactivateUser();
    const reactivate = useReactivateUser();
    const changeRole = useChangeUserRole();

    if (isLoading) return <AppLayout title="Users"><p className="text-sm text-muted">Loading…</p></AppLayout>;
    if (error) return <AppLayout title="Users"><p className="text-sm text-danger">Could not load users.</p></AppLayout>;

    return (
        <AppLayout title="Users">
        <table className="w-full bg-white border border-border rounded-lg overflow-hidden text-sm max-w-4xl">
            <thead>
            <tr className="bg-surface border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Office</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
            </tr>
            </thead>
            <tbody>
            {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                    <div className="font-semibold">{u.full_name}</div>
                    <div className="text-xs text-muted font-mono">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                    {u.id === currentUser.id ? (
                        <span className="text-xs capitalize text-muted">{u.role} (you)</span>
                    ) : (
                        <select
                        value={u.role}
                        onChange={(e) => changeRole.mutate({ userId: u.id, newRole: e.target.value })}
                        className="text-xs border border-border rounded px-2 py-1 capitalize"
                        >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    )}
                </td>
                <td className="px-4 py-3 capitalize">{u.office}</td>
                <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.is_active ? 'text-success' : 'text-muted'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-success' : 'bg-border'}`} />
                    {u.is_active ? 'Active' : 'Deactivated'}
                    </span>
                </td>
                <td className="px-4 py-3">
                    {u.id !== currentUser.id && (
                        <button
                        onClick={() => u.is_active ? deactivate.mutate(u.id) : reactivate.mutate(u.id)}
                        className="text-xs font-semibold text-navy underline"
                        >
                        {u.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </AppLayout>
    );
}
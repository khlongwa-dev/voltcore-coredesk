import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Input from '../components/ui/Input';
import Button from "../components/ui/Button";
import { useCreateTicket } from "../hooks/useTickets";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ['hardware', 'software', 'network', 'access', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export default function NewTicketPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const createTicket = useCreateTicket();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'hardware',
        priority: 'medium',
        office: user?.office || 'durban',
    });
    const [error, setError] = useState('');

    function update(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const ticket = await createTicket.mutateAsync(form);
            navigate(`/tickets/${ticket.id}`);
        } catch {
            setError('Could not create ticket - check the fields and try again.');
        }
    }

    return (
        <AppLayout title="New Ticket">
            <form onSubmit={handleSubmit} className="max-w-lg bg-white border border-border rounded-lg p-6 space-y-4">
                {error && (
                    <div className="bg-red-50 text-danger text-sm rounded-md px-3 py-2">{error}</div>
                )}

                <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />

                <div>
                    <label className="block text-xs font-semibold text-muted uppercase mb-1">Description</label>
                    <textarea 
                        value={form.description} onChange={(e) => update('description', e.target.value)} required
                        rows={4}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-navy"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1">Category</label>
                        <select
                            value={form.category} onChange={(e) => update('category', e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm capitalize"
                        >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1">Priority</label>
                        <select
                            value={form.priority} onChange={(e) => update('priority', e.target.value)}
                            className="w-full border border-border rounded-md px-3 py-2 text-sm capitalize"
                        >
                            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                <Button type="submit" disabled={createTicket.isPending}>
                    {createTicket.isPending ? 'Creating...' : 'Submit Ticket'}
                </Button>
            </form>
        </AppLayout>
    );
}

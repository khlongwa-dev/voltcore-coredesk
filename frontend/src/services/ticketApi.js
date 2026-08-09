import api from './api'

export async function fetchTickets({ office, assignedToMe, status } = {}) {
    const params = {};
    if (office) params.office = office;
    if (assignedToMe) params.assigned_to_me = true;
    if (status) params.status = status;

    const response = await api.get('/api/tickets', { params });
    return response.data;
}

export async function fetchTicket(ticketId) {
    const response = await api.get(`/api/tickets/${ticketId}`);
    return response.data;
}

export async function createTicket(payload) {
    const response = await api.post('/api/tickets', payload);
    return response.data;
}

export async function updateTicketDetails(ticketId, payload) {
    const response = await api.patch(`/api/tickets/${ticketId}`, payload);
    return response.data;
}

export async function assignTicket(ticketId, assignedTo) {
    const response = await api.patch(`/api/tickets/${ticketId}/assign`, { assigned_to: assignedTo });
    return response.data;
}

export async function updateTicketStatus(ticketId, newStatus) {
    const response = await api.patch(`/api/tickets/${ticketId}/status`, null, {
        params: { new_status: newStatus },
    });
    return response.data;
}
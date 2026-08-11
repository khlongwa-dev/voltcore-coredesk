import api from './api';

export async function fetchComments(ticketId) {
    const response = await api.get(`/api/tickets/${ticketId}/comments`);
    return response.data;
}

export async function createComment(ticketId, payload) {
    const response = await api.post(`/api/tickets/${ticketId}/comments`, payload);
    return response.data;
}
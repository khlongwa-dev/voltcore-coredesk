import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ticketApi from '../services/ticketApi';

export function useTickets(filters) {
    return useQuery({
        queryKey: ['tickets', filters],
        queryFn: () => ticketApi.fetchTickets(filters),
    });
}

export function useTicket(ticketId) {
    return useQuery({
        queryKey: ['ticket', ticketId],
        queryFn: () => ticketApi.fetchTicket(ticketId),
        enabled: !!ticketId,
    });
}

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ticketApi.createTicket,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
    });
}

export function useAssignTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, assignedTo }) => ticketApi.assignTicket(ticketId, assignedTo),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
        },
    });
}

export function useUpdateTicketStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, newStatus }) => ticketApi.updateTicketStatus(ticketId, newStatus),
        onSuccess: (_, { ticketId }) => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
        },
    });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentApi from '../services/commentApi';

export function useComments(ticketId) {
    return useQuery({
        queryKey: ['comments', ticketId],
        queryFn: () => commentApi.fetchComments(ticketId),
        enabled: !!ticketId,
    });
}

export function useCreateComment(ticketId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => commentApi.createComment(ticketId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', ticketId] }),
    });
}
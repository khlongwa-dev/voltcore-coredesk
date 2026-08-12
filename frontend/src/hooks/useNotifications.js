import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationApi from '../services/notificationApi';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.fetchNotifications,
    refetchInterval: 30000, // poll every 30s so the badge updates without a manual refresh
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
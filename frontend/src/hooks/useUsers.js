import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../services/userApi';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.fetchUsers,
  });
}

function useUserMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeactivateUser() {
  return useUserMutation((userId) => userApi.deactivateUser(userId));
}

export function useReactivateUser() {
  return useUserMutation((userId) => userApi.reactivateUser(userId));
}

export function useChangeUserRole() {
  return useUserMutation(({ userId, newRole }) => userApi.changeUserRole(userId, newRole));
}
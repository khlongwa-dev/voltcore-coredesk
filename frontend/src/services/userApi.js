import api from './api';

export async function fetchUsers() {
  const response = await api.get('/api/users');
  return response.data;
}

export async function deactivateUser(userId) {
  const response = await api.patch(`/api/users/${userId}/deactivate`);
  return response.data;
}

export async function reactivateUser(userId) {
  const response = await api.patch(`/api/users/${userId}/reactivate`);
  return response.data;
}

export async function changeUserRole(userId, newRole) {
  const response = await api.patch(`/api/users/${userId}/role`, null, {
    params: { new_role: newRole },
  });
  return response.data;
}
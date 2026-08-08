import api from './api'

export async function login(email, password) {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);

    const response = await api.post('/api/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
}

export async function changePassword(currentPassword, newPassword) {
    const response = await api.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
    });
    return response.data;
}
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from '../services/authApi'

const AuthContext = createContext(null);

export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('coredesk_token');
        if(!token) {
            setLoading(false);
            return;
        }
        authApi
            .getCurrentUser()
            .then(setUser)
            .catch(() => localStorage.removeItem('coredesk_token'))
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const data = await authApi.login(email, password);
        localStorage.setItem('coredesk_token', data.access_token);
        const me = await authApi.getCurrentUser();
        setUser(me);
        return data
    }

    function logout() {
        localStorage.removeItem('coredesk_token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
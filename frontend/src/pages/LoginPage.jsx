/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const data = await login(email, password);
            navigate(data.must_change_password ? '/change-password' : '/dashboard');
        } catch (err) {
            setError('Incorrect email or password.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center font-sans">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-border rounded-lg p-8 w-full max-w-sm"
            >
                <div className="font-mono text-xs tracking-widest text-orange uppercase mb-1">
                    Voltcore
                </div>
                <h1 className="text-xl font-bold text-ink mb-6">Coredesk</h1>

                {error && (
                    <div className="bg-red-50 text-danger text-sm rounded-md px-3 py-2 mb-4">
                        { error }
                    </div>
                )}

                <label className="block text-xs font-semibold text-muted uppercase mb-1">
                    Email
                </label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-border rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:border-navy"
                />

                <label className="block text-xs font-semibold text-muted uppercase mb-1">
                    Password
                </label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-border rounded-md px-3 py-2 mb-6 text-sm focus:outline-none focus:border-navy" 
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange hover:bg-orange-light text-white font-semibold text-sm rounded-md py-2.5 disabled:opacity-60"
                >
                    {submitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}

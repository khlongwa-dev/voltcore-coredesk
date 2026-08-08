/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const updatedUser = await changePassword(currentPassword, newPassword);
            setUser(updatedUser);
            navigate('/dashboard');
        } catch (err) {
            setError('Could not update password - check your current password.');
        }
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center font-sans">
            <form  onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8 w-full max-w-sm">
                <h1 className="text-xl font-bold text-ink mb-6">Set a new password</h1>
                {error && <div className="bg-red-50 text-danger text-sm rounded-md px-3 py-2 mb-4">{error}</div>}
                <input
                    type="password" placeholder="Current password" value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} required
                    className="w-full border border-border rounded-md px-3 py-2 mb-4 text-sm"
                />
                <input
                    type="password" placeholder="New password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} required
                    className="w-full border border-border rounded-md px-3 py-2 mb-6 text-sm"
                />
                <button type="submit" className="w-full bg-navy text-white font-semibold text-sm rounded-md py-2.5">
                    Update Password
                </button>
            </form>
        </div>
    )
}
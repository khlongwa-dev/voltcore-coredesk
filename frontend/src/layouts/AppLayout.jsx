import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from '../hooks/useNotifications';

const NAV_ITEMS = {
    employee: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/tickets', label: 'My Ticket' },
        { to: '/tickets/new', label: 'New Ticket' },
        { to: '/notifications', label: 'Notifications'},
    ],
    agent: [
        { to: '/dashboard', label: 'Dashboard'},
        { to: '/tickets', label: 'All Ticket' },
        { to: '/tickets?assigned_to_me=true', label: 'My Queue' },
        { to: '/notifications', label: 'Notifications'},
    ],
    admin: [
        { to: '/dashboard', label: 'Overview' },
        { to: '/tickets', label: 'All Tickets' },
        { to: '/users', label: 'Users' },
        { to: '/notifications', label: 'Notifications'},
    ],
};

function initials(name = '') {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function AppLayout({ title, children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const { data: notifications } = useNotifications();
    const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
    const items = NAV_ITEMS[user?.role] || [];

    return (
        <div className="h-screen overflow-hidden grid grid-cols-[220px_1fr] font-sans bg-surface text-ink">
            <aside className="bg-navy text-white flex flex-col py-6">
                <div className="px-6 pb-7 mb-5 border-b border-white/10">
                    <div className="font-mono text-xs tracking-widest text-orange-light uppercase">Voltcore</div>
                    <div className="text-lg font-bold mt-1">Coredesk</div>
                </div>
                <nav className="flex flex-col">
                    {items.map((item) => {
                        const fullCurrentPath = location.pathname + location.search;
                        const isActive = fullCurrentPath === item.to;
                        return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center justify-between px-6 py-2.5 text-sm font-medium border-l-2 ${
                            isActive
                                ? 'text-white bg-white/5 border-orange'
                                : 'text-white/70 border-transparent hover:text-white'
                            }`}
                        >
                            <span>{item.label}</span>
                            {item.to === '/notifications' && (
                                <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded-full ${
                                    unreadCount > 0 ? 'bg-orange text-white' : 'bg-white/10 text-white/50'
                                }`}>
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        );
                    })}
                </nav>
                <div className="mt-auto px-6 pt-4 border-t border-white/10 text-xs text-white/55">
                    {user?.office === 'durban' ? 'Durban HQ' : user?.office === 'johannesburg' ? 'Johannesburg Branch' : ''}
                </div>
            </aside>

            <div className="flex flex-col min-h-0">
                <header className="h-16 bg-white border-b border-border flex items-center justify-between px-7">
                    <h1 className="text-[17px] font-bold">{title}</h1>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
                            {initials(user?.full_name)}
                        </div>
                        <div>
                            <div className="text-[13px] font-semibold">{user?.full_name}</div>
                            <div className="text-[11px] text-muted font-mono uppercase tracking-wide">{user?.role}</div>
                        </div>
                        <button onClick={logout} className="ml-3 text-xs text-navy underline">Log out</button>
                    </div>
                </header>
                <main className="flex-1 p-7 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
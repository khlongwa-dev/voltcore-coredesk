const STYLES = {
    admin: 'bg-navy text-white',
    agent: 'bg-orange/10 text-orange',
    employee: 'bg-border/60 text-muted',
};

export default function Badge({ children, tone = 'employee' }) {
    return (
        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wide ${STYLES[tone] || STYLES.employee}`}>
            {children}
        </span>
    );
}
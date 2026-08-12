const STYLES = {
    open: 'bg-blue-50 text-blue-700',
    pending: 'bg-purple-50 text-purple-700',
    in_progress: 'bg-orange/10 text-warn',
    resolved: 'bg-green-50 text-success',
    closed: 'bg-border/60 text-muted',
};

const LABELS = {
    open: 'Open',
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
};

export default function StatusPill({ status }) {
    return (
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${STYLES[status] || STYLES.open}`}>
            {LABELS[status] || status}
        </span>
    );
}
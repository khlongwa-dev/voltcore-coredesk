const STYLES = {
    critical: 'text-orange',
    high: 'text-warn',
    medium: 'text-navy-light',
    low: 'text-muted',
};

export default function PriorityTag({ priority }) {
    return (
        <span className={`text-[11px] font-bold uppercase tracking-wide ${STYLES[priority] || STYLES.medium}`}>
            {priority}
        </span>
    );
}
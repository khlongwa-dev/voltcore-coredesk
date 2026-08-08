export default function Card({ children, className = '', priority }) {
    const stripe = priority === 'critical' ? 'border-l-4 border-l-orange'
        : priority === 'high' ? 'border-l-4 border-l-warn'
        : 'border-l-4 border-l-transparent';
    
    return (
        <div className={`bg-white border border-border rounded-lg ${stripe} ${className}`}>
            {children}
        </div>
    );
}
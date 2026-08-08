export default function Input({ label, className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-semibold text-muted uppercase mb-1">
                    {label}
                </label>
            )}
            <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-navy" {...props} />
        </div>
    );
}
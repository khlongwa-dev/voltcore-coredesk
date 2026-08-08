export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-ink">{title}</h2>
                    <button onClick={onClose} className="text-muted hover:text-ink text-lg leading-none">x</button>
                </div>
                {children}
            </div>
        </div>
    );
}
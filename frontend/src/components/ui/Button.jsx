export default function Button({ variant = 'primary', className = '', ...props}) {
    const base = 'text-sm font-semibold rounded-md px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-orange hover:bg-orange-light text-white',
        secondary: 'bg-navy hover:bg-navy-light text-white',
        ghost: 'bg-transparent hover:bg-surface text-navy border border-border',
        danger: 'bg-danger hover:opacity-90 text-white',
    };
    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
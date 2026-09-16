const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
};

const SIZES = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3.5 py-2 text-sm gap-1.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...rest
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

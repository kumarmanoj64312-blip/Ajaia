export default function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
      {icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
          {icon}
        </span>
      )}
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && <p className="max-w-xs text-xs text-slate-400">{description}</p>}
    </div>
  );
}

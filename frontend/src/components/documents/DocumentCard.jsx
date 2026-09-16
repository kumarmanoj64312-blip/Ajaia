import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar.jsx';
import { IconFileText, IconEye, IconPencil } from '../common/icons.jsx';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

const PERMISSION_META = {
  owner: { label: 'Owner', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: null },
  edit: { label: 'Can edit', className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200', icon: IconPencil },
  view: { label: 'Can view', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', icon: IconEye },
};

export default function DocumentCard({ doc, ownerLabel }) {
  const meta = PERMISSION_META[doc.permission] || PERMISSION_META.view;
  const PermIcon = meta.icon;

  return (
    <Link
      to={`/documents/${doc.id}`}
      className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition group-hover:bg-brand-50 group-hover:text-brand-600">
          <IconFileText className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">{doc.title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">Updated {formatRelativeTime(doc.updatedAt)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {ownerLabel ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={doc.owner?.name} size="sm" />
            <span className="text-xs text-slate-500">{doc.owner?.name}</span>
          </div>
        ) : (
          <span />
        )}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}
        >
          {PermIcon && <PermIcon className="h-3 w-3" />}
          {meta.label}
        </span>
      </div>
    </Link>
  );
}

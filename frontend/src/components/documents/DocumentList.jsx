import DocumentCard from './DocumentCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { IconFileText } from '../common/icons.jsx';

export default function DocumentList({ title, documents, emptyMessage, showOwner = false }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
          {documents.length}
        </span>
      </div>
      {documents.length === 0 ? (
        <EmptyState icon={<IconFileText className="h-5 w-5" />} title={emptyMessage} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} ownerLabel={showOwner} />
          ))}
        </div>
      )}
    </section>
  );
}

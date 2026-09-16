import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import DocumentList from '../components/documents/DocumentList.jsx';
import ImportModal from '../components/documents/ImportModal.jsx';
import Button from '../components/common/Button.jsx';
import { IconPlus, IconUpload } from '../components/common/icons.jsx';
import { useDocuments } from '../hooks/useDocuments.js';

export default function DashboardPage() {
  const { owned, shared, loading, refresh } = useDocuments();
  const [importOpen, setImportOpen] = useState(false);
  const navigate = useNavigate();

  // Nothing is created yet — this opens a local draft. The document is only
  // persisted once the user clicks "Create" on that page, so navigating away
  // without writing anything never leaves an empty doc behind.
  const handleCreate = () => navigate('/documents/new');

  return (
    <div>
      <Navbar />
      <main className="w-full px-4 py-8 sm:px-6 lg:px-10 2xl:px-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your documents</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Create, edit, and share rich-text documents with your team.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              <IconUpload className="h-4 w-4" />
              Import file
            </Button>
            <Button onClick={handleCreate}>
              <IconPlus className="h-4 w-4" />
              New document
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : (
          <>
            <DocumentList
              title="My documents"
              documents={owned}
              emptyMessage="You haven't created any documents yet."
            />
            <DocumentList
              title="Shared with me"
              documents={shared}
              emptyMessage="No one has shared a document with you yet."
              showOwner
            />
          </>
        )}
      </main>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={refresh} />
    </div>
  );
}

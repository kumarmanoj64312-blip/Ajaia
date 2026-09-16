import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import RichTextEditor from '../components/editor/RichTextEditor.jsx';
import ShareModal from '../components/documents/ShareModal.jsx';
import Button from '../components/common/Button.jsx';
import Avatar from '../components/common/Avatar.jsx';
import { IconArrowLeft, IconShare, IconTrash, IconEye, IconCheck } from '../components/common/icons.jsx';
import * as documentsApi from '../api/documents.api';
import { useAutosave } from '../hooks/useAutosave.js';
import { useToast } from '../components/common/Toast.jsx';
import { getErrorMessage } from '../utils/errorMessage';

const EMPTY_CONTENT = { type: 'doc', content: [{ type: 'paragraph' }] };

const SAVE_STATUS = {
  idle: { label: '', dot: '' },
  saving: { label: 'Saving…', dot: 'bg-amber-400' },
  saved: { label: 'Saved', dot: 'bg-emerald-500' },
  error: { label: 'Error saving', dot: 'bg-red-500' },
};

export default function DocumentEditorPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState(isNew ? 'Untitled document' : '');
  const [shareOpen, setShareOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  // Tracks the last content actually loaded/saved for the CURRENT document, so
  // a stray onUpdate from the editor re-initializing on document switch (or a
  // no-op edit) doesn't trigger a pointless save / "Saving…" flash.
  const lastContentRef = useRef(null);
  // Holds in-progress edits to a not-yet-created draft — nothing is persisted
  // until the user explicitly clicks "Create".
  const draftContentRef = useRef(EMPTY_CONTENT);

  const saveContent = useCallback(
    async (content) => {
      if (!id || isNew) return;
      await documentsApi.saveDocumentContent(id, content);
    },
    [id, isNew]
  );
  const { status: saveStatus, trigger: triggerSave, reset: resetSaveStatus } = useAutosave(saveContent);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setTitle('Untitled document');
      draftContentRef.current = EMPTY_CONTENT;
      return;
    }

    let cancelled = false;
    setLoading(true);
    resetSaveStatus();
    documentsApi
      .getDocument(id)
      .then((data) => {
        if (cancelled) return;
        setDoc(data);
        setTitle(data.title);
        lastContentRef.current = JSON.stringify(data.content);
      })
      .catch((err) => {
        showToast(getErrorMessage(err, 'Could not load document'), 'error');
        navigate('/');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  const isOwner = isNew || doc?.permission === 'owner';
  const canEdit = isNew || doc?.permission === 'owner' || doc?.permission === 'edit';

  const handleTitleBlur = async () => {
    if (isNew) return; // title is only persisted when the draft is created
    if (!doc || title.trim() === '' || title === doc.title) {
      setTitle(doc?.title || '');
      return;
    }
    try {
      const updated = await documentsApi.renameDocument(doc.id, title.trim());
      setDoc((prev) => ({ ...prev, title: updated.title, updatedAt: updated.updatedAt }));
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not rename document'), 'error');
      setTitle(doc.title);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    try {
      await documentsApi.deleteDocument(doc.id);
      showToast('Document deleted', 'success');
      navigate('/');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete document'), 'error');
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const created = await documentsApi.createDocument(title.trim() || undefined);
      if (JSON.stringify(draftContentRef.current) !== JSON.stringify(EMPTY_CONTENT)) {
        await documentsApi.saveDocumentContent(created.id, draftContentRef.current);
      }
      showToast('Document created', 'success');
      navigate(`/documents/${created.id}`, { replace: true });
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not create document'), 'error');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="w-full px-4 py-6 sm:px-6 lg:px-10 2xl:px-16">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-[60vh] animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    );
  }

  if (!isNew && !doc) return null;

  const status = SAVE_STATUS[saveStatus] || SAVE_STATUS.idle;

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 lg:px-10 2xl:px-16">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Back to dashboard"
            >
              <IconArrowLeft className="h-4 w-4" />
            </Link>
            {isOwner ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="min-w-0 flex-1 rounded-lg border border-transparent px-2 py-1 text-xl font-bold tracking-tight text-slate-900 transition hover:border-slate-200 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            ) : (
              <h1 className="truncate px-2 py-1 text-xl font-bold tracking-tight text-slate-900">
                {doc.title}
              </h1>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 pl-10 sm:pl-0">
            {isNew ? (
              <span className="text-xs font-medium text-slate-400">Draft — not saved yet</span>
            ) : (
              <>
                {canEdit && status.label && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                )}
                {!canEdit && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                    <IconEye className="h-3.5 w-3.5" />
                    Read only
                  </span>
                )}
                {doc.sharedWith.length > 0 && (
                  <div className="hidden -space-x-1.5 sm:flex">
                    {doc.sharedWith.slice(0, 4).map((s) => (
                      <Avatar
                        key={s.user.id}
                        name={s.user.name}
                        size="sm"
                        className="ring-2 ring-slate-50"
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {isNew ? (
              <Button size="sm" onClick={handleCreate} disabled={creating}>
                <IconCheck className="h-3.5 w-3.5" />
                {creating ? 'Creating…' : 'Create'}
              </Button>
            ) : (
              isOwner && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setShareOpen(true)}>
                    <IconShare className="h-3.5 w-3.5" />
                    Share
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    <IconTrash className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </>
              )
            )}
          </div>
        </div>

        <div className="flex-1">
          <RichTextEditor
            key={isNew ? 'new' : doc.id}
            content={isNew ? draftContentRef.current : doc.content}
            readOnly={!canEdit}
            onChange={(content) => {
              if (isNew) {
                draftContentRef.current = content;
                return;
              }
              const serialized = JSON.stringify(content);
              if (serialized === lastContentRef.current) return;
              lastContentRef.current = serialized;
              triggerSave(content);
            }}
          />
        </div>
      </div>

      {!isNew && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          document={doc}
          onUpdated={setDoc}
        />
      )}
    </div>
  );
}

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { IconUpload, IconFileText } from '../common/icons.jsx';
import * as documentsApi from '../../api/documents.api';
import { useToast } from '../common/Toast.jsx';
import { getErrorMessage } from '../../utils/errorMessage';

const ACCEPTED_EXTENSIONS = ['.txt', '.md'];

export default function ImportModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const ext = `.${selected.name.split('.').pop().toLowerCase()}`;
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      showToast('Only .txt and .md files are supported', 'error');
      e.target.value = '';
      return;
    }
    setFile(selected);
  };

  const handleImport = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      const doc = await documentsApi.importDocument(file);
      onImported(doc);
      showToast(`Imported "${doc.title}"`, 'success');
      setFile(null);
      onClose();
      navigate(`/documents/${doc.id}`);
    } catch (err) {
      showToast(getErrorMessage(err, 'Import failed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Import a document">
      <p className="mb-4 text-sm text-slate-500">
        Supported file types: <strong className="text-slate-700">.txt</strong> and{' '}
        <strong className="text-slate-700">.md</strong>. The file's content becomes a new document
        you own.
      </p>

      <label
        htmlFor="import-file-input"
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center transition hover:border-brand-300 hover:bg-brand-50/40"
      >
        {file ? (
          <>
            <IconFileText className="h-6 w-6 text-brand-600" />
            <span className="text-sm font-medium text-slate-700">{file.name}</span>
            <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
          </>
        ) : (
          <>
            <IconUpload className="h-6 w-6 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Click to choose a file</span>
            <span className="text-xs text-slate-400">.txt or .md, up to 5MB</span>
          </>
        )}
      </label>
      <input
        ref={inputRef}
        id="import-file-input"
        type="file"
        accept=".txt,.md"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button onClick={handleImport} disabled={!file || submitting} className="mt-4 w-full">
        <IconUpload className="h-4 w-4" />
        {submitting ? 'Importing…' : 'Import'}
      </Button>
    </Modal>
  );
}

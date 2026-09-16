import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Avatar from '../common/Avatar.jsx';
import { IconShare } from '../common/icons.jsx';
import * as sharesApi from '../../api/shares.api';
import { useToast } from '../common/Toast.jsx';
import { getErrorMessage } from '../../utils/errorMessage';

export default function ShareModal({ open, onClose, document, onUpdated }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!document) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await sharesApi.shareDocument(document.id, email.trim(), permission);
      onUpdated(updated);
      showToast(`Shared with ${email.trim()}`, 'success');
      setEmail('');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not share document'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (userId) => {
    try {
      const updated = await sharesApi.revokeShare(document.id, userId);
      onUpdated(updated);
      showToast('Access revoked', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not revoke access'), 'error');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Share "${document.title}"`}>
      <form onSubmit={handleShare} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          placeholder="teammate@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="flex gap-2">
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="view">Can view</option>
            <option value="edit">Can edit</option>
          </select>
          <Button type="submit" disabled={submitting} className="flex-shrink-0">
            <IconShare className="h-4 w-4" />
            {submitting ? 'Sharing…' : 'Share'}
          </Button>
        </div>
      </form>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          People with access
        </h3>
        {document.sharedWith.length === 0 ? (
          <p className="text-sm text-slate-400">Not shared with anyone yet.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {document.sharedWith.map((share) => (
              <li
                key={share.user.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Avatar name={share.user.name} size="sm" />
                  <div>
                    <p className="font-medium text-slate-700">{share.user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{share.permission}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(share.user.id)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

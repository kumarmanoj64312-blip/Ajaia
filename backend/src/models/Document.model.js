const mongoose = require('mongoose');

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

const shareSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    permission: { type: String, enum: ['view', 'edit'], required: true },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, default: 'Untitled document' },
    // TipTap/ProseMirror JSON document — stored as-is so formatting round-trips exactly.
    content: { type: mongoose.Schema.Types.Mixed, default: () => EMPTY_DOC },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sharedWith: { type: [shareSchema], default: [] },
  },
  { timestamps: true }
);

documentSchema.index({ owner: 1, updatedAt: -1 });
documentSchema.index({ 'sharedWith.user': 1 });

// this.owner / share.user may be a raw ObjectId or a populated User document
// depending on whether .populate() has run — handle both.
function idOf(value) {
  return value && value._id ? value._id : value;
}

documentSchema.methods.permissionFor = function permissionFor(userId) {
  const uid = String(userId);
  if (String(idOf(this.owner)) === uid) return 'owner';
  const share = this.sharedWith.find((s) => String(idOf(s.user)) === uid);
  return share ? share.permission : null;
};

documentSchema.statics.EMPTY_DOC = EMPTY_DOC;

module.exports = mongoose.model('Document', documentSchema);

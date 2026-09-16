const Document = require('../models/Document.model');

function serialize(doc, viewerId) {
  return {
    id: doc._id,
    title: doc.title,
    content: doc.content,
    owner: doc.owner._id
      ? { id: doc.owner._id, name: doc.owner.name, email: doc.owner.email }
      : doc.owner,
    sharedWith: doc.sharedWith.map((s) => ({
      user: s.user._id
        ? { id: s.user._id, name: s.user.name, email: s.user.email }
        : s.user,
      permission: s.permission,
    })),
    permission: doc.permissionFor(viewerId),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function createDocument({ ownerId, title }) {
  const doc = await Document.create({
    owner: ownerId,
    title: title || 'Untitled document',
  });
  return serialize(await doc.populate('owner', 'name email'), ownerId);
}

async function listForUser(userId) {
  const [owned, shared] = await Promise.all([
    Document.find({ owner: userId })
      .sort({ updatedAt: -1 })
      .populate('owner', 'name email')
      .populate('sharedWith.user', 'name email'),
    Document.find({ 'sharedWith.user': userId })
      .sort({ updatedAt: -1 })
      .populate('owner', 'name email')
      .populate('sharedWith.user', 'name email'),
  ]);

  return {
    owned: owned.map((d) => serialize(d, userId)),
    shared: shared.map((d) => serialize(d, userId)),
  };
}

async function getDocument(doc, viewerId) {
  await doc.populate('owner', 'name email');
  await doc.populate('sharedWith.user', 'name email');
  return serialize(doc, viewerId);
}

async function renameDocument(doc, title, viewerId) {
  doc.title = title;
  await doc.save();
  return getDocument(doc, viewerId);
}

async function updateContent(doc, content, viewerId) {
  doc.content = content;
  await doc.save();
  return getDocument(doc, viewerId);
}

async function deleteDocument(doc) {
  await doc.deleteOne();
}

async function importDocument({ ownerId, title, content }) {
  const doc = await Document.create({ owner: ownerId, title, content });
  return serialize(await doc.populate('owner', 'name email'), ownerId);
}

module.exports = {
  createDocument,
  listForUser,
  getDocument,
  renameDocument,
  updateContent,
  deleteDocument,
  importDocument,
  serialize,
};

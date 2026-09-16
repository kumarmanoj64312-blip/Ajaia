const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { serialize } = require('./document.service');

async function shareDocument(doc, { email, permission }, ownerId) {
  const targetUser = await User.findOne({ email });
  if (!targetUser) {
    throw ApiError.badRequest('No user found with that email');
  }

  if (String(targetUser._id) === String(ownerId)) {
    throw ApiError.badRequest('You cannot share a document with yourself');
  }

  const existing = doc.sharedWith.find((s) => String(s.user) === String(targetUser._id));
  if (existing) {
    existing.permission = permission;
  } else {
    doc.sharedWith.push({ user: targetUser._id, permission });
  }

  await doc.save();
  await doc.populate('owner', 'name email');
  await doc.populate('sharedWith.user', 'name email');
  return serialize(doc, ownerId);
}

async function revokeShare(doc, targetUserId, ownerId) {
  doc.sharedWith = doc.sharedWith.filter((s) => String(s.user) !== String(targetUserId));
  await doc.save();
  await doc.populate('owner', 'name email');
  await doc.populate('sharedWith.user', 'name email');
  return serialize(doc, ownerId);
}

module.exports = { shareDocument, revokeShare };

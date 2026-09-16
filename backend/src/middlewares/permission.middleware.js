const mongoose = require('mongoose');
const Document = require('../models/Document.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const RANK = { view: 1, edit: 2, owner: 3 };

/**
 * Loads the document from req.params.id, computes the caller's permission
 * level (owner / edit / view / null), and enforces a minimum level.
 * Attaches req.document and req.permission for downstream handlers.
 */
function requireDocumentAccess(minLevel) {
  return asyncHandler(async function requireDocumentAccess(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.notFound('Document not found');
    }

    const document = await Document.findById(id);
    if (!document) {
      throw ApiError.notFound('Document not found');
    }

    const permission = document.permissionFor(req.user._id);

    if (!permission || RANK[permission] < RANK[minLevel]) {
      throw ApiError.forbidden('You do not have access to this document');
    }

    req.document = document;
    req.permission = permission;
    next();
  });
}

module.exports = { requireDocumentAccess };

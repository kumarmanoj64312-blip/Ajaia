const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const shareService = require('../services/share.service');

const share = asyncHandler(async (req, res) => {
  const doc = await shareService.shareDocument(req.document, req.body, req.user._id);
  return new ApiResponse(200, doc, 'Document shared').send(res);
});

const revoke = asyncHandler(async (req, res) => {
  const doc = await shareService.revokeShare(req.document, req.params.userId, req.user._id);
  return new ApiResponse(200, doc, 'Access revoked').send(res);
});

module.exports = { share, revoke };

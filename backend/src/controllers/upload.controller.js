const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const importService = require('../services/import.service');

const importDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file uploaded');
  }

  const doc = await importService.importFile({
    ownerId: req.user._id,
    originalName: req.file.originalname,
    buffer: req.file.buffer,
  });

  return new ApiResponse(201, doc, 'Document imported').send(res);
});

module.exports = { importDocument };

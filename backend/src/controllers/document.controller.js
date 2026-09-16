const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const documentService = require('../services/document.service');

const create = asyncHandler(async (req, res) => {
  const doc = await documentService.createDocument({
    ownerId: req.user._id,
    title: req.body.title,
  });
  return new ApiResponse(201, doc, 'Document created').send(res);
});

const list = asyncHandler(async (req, res) => {
  const docs = await documentService.listForUser(req.user._id);
  return new ApiResponse(200, docs, 'Documents fetched').send(res);
});

const getOne = asyncHandler(async (req, res) => {
  const doc = await documentService.getDocument(req.document, req.user._id);
  return new ApiResponse(200, doc, 'Document fetched').send(res);
});

const rename = asyncHandler(async (req, res) => {
  const doc = await documentService.renameDocument(req.document, req.body.title, req.user._id);
  return new ApiResponse(200, doc, 'Document renamed').send(res);
});

const updateContent = asyncHandler(async (req, res) => {
  const doc = await documentService.updateContent(req.document, req.body.content, req.user._id);
  return new ApiResponse(200, doc, 'Document saved').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.document);
  return new ApiResponse(200, null, 'Document deleted').send(res);
});

module.exports = { create, list, getOne, rename, updateContent, remove };

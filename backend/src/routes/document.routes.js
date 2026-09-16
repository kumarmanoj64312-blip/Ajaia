const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireDocumentAccess } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createDocumentSchema,
  renameDocumentSchema,
  updateContentSchema,
} = require('../validators/document.validator');
const documentController = require('../controllers/document.controller');
const shareRoutes = require('./share.routes');

const router = express.Router();

router.use(requireAuth);

router.post('/', validate(createDocumentSchema), documentController.create);
router.get('/', documentController.list);

router.get('/:id', requireDocumentAccess('view'), documentController.getOne);
router.patch(
  '/:id/title',
  requireDocumentAccess('owner'),
  validate(renameDocumentSchema),
  documentController.rename
);
router.patch(
  '/:id/content',
  requireDocumentAccess('edit'),
  validate(updateContentSchema),
  documentController.updateContent
);
router.delete('/:id', requireDocumentAccess('owner'), documentController.remove);

// Nested share routes: /api/documents/:id/shares
router.use('/:id/shares', shareRoutes);

module.exports = router;

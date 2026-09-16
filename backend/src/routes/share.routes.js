const express = require('express');
const { requireDocumentAccess } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { shareDocumentSchema } = require('../validators/share.validator');
const shareController = require('../controllers/share.controller');

// mergeParams so :id from the parent /documents/:id/shares mount is visible here
const router = express.Router({ mergeParams: true });

// Sharing is owner-only: only the owner can grant or revoke access.
router.use(requireDocumentAccess('owner'));

router.post('/', validate(shareDocumentSchema), shareController.share);
router.delete('/:userId', shareController.revoke);

module.exports = router;

const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middlewares/auth.middleware');
const env = require('../config/env');
const uploadController = require('../controllers/upload.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadSizeBytes },
});

const router = express.Router();

router.use(requireAuth);

router.post('/import', upload.single('file'), uploadController.importDocument);

module.exports = router;

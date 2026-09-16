const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', requireAuth, authController.me);

module.exports = router;

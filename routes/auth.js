const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

// مسار التسجيل - مع validation middleware
router.post('/register', validate(registerSchema), authController.register);

// مسار تسجيل الدخول - مع validation middleware
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
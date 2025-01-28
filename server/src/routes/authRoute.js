const AuthController = require('../app/controllers/AuthController');
const router = require('express').Router();

// Middleware
const { authRequired  } = require('../app/middlewares/validateToken');

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/verify-token', AuthController.verifyToken);
router.get('/profile', authRequired, AuthController.profile);

module.exports = router;
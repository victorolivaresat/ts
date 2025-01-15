const AuthController = require('../app/controllers/AuthController');
const router = require('express').Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/profile', AuthController.profile);
router.get('/verify-token', AuthController.verifyToken);

module.exports = router;
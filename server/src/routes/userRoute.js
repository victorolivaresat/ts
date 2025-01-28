const UserController = require('../app/controllers/UserController');
const router = require('express').Router();

// Middleware
const { authRequired  } = require('../app/middlewares/validateToken');

router.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

router.get('/users', authRequired, UserController.getUsers);
router.post('/users', authRequired, UserController.createUser);
router.get('/users/:id', authRequired, UserController.getUser);
router.put('/users/:id', authRequired, UserController.updateUser);
router.patch('/users/:id/status', authRequired, UserController.changeStatus);

module.exports = router;
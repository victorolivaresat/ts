const UserController = require('../app/controllers/UserController');
const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

router.get('/users', UserController.getUsers);
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUser);
router.put('/users/:id', UserController.updateUser);
router.patch('/users/:id/status', UserController.changeStatus);

module.exports = router;
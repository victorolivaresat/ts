const UserController = require('../app/controllers/UserController');
const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

router.get('/users', UserController.getUsers);

module.exports = router;
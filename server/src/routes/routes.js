const routes = require('express').Router();

const userRoute = require('./userRoute');
const authRoute = require('./authRoute');

routes.use(userRoute);
routes.use(authRoute);

module.exports = routes;
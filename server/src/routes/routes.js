const routes = require('express').Router();

const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');

routes.use(userRoute);
routes.use(authRoute);
routes.use(dashboardRoute);

module.exports = routes;
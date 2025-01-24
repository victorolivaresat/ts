const routes = require('express').Router();

const bcpRoute = require('./bcpRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');

routes.use(bcpRoute);
routes.use(userRoute);
routes.use(authRoute);
routes.use(dashboardRoute);

module.exports = routes;
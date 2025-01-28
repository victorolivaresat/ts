const routes = require('express').Router();

const atRoute = require('./atRoute');
const bcpRoute = require('./bcpRoute');
const ibkRoute = require('./ibkRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const uploadRoute = require('./uploadRoute');
const dashboardRoute = require('./dashboardRoute');

routes.use(atRoute);
routes.use(bcpRoute);
routes.use(ibkRoute);
routes.use(userRoute);
routes.use(authRoute);
routes.use(uploadRoute);
routes.use(dashboardRoute);

module.exports = routes;
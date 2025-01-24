const DashboardController = require('../app/controllers/DashboardController');
const router = require('express').Router();

// Middleware
const { authRequired  } = require('../app/middlewares/validateToken');

router.get('/monthly-amount-sums', authRequired, DashboardController.getMonthlyAmountSums);
router.get("/ibk-daily-amounts", DashboardController.getIbkDailyAmountsForChart);
router.get("/bcp-daily-amounts", DashboardController.getBcpDailyAmountsForChart);

module.exports = router;
const ReconciliationController = require("../app/controllers/ReconciliationController");
const router = require("express").Router();

// Middleware
const { authRequired } = require("../app/middlewares/validateToken");

router.get("/bcp-reconciliation/:id", authRequired, ReconciliationController.getBcpReconciliation);
router.get("/bcp-reconciliations", authRequired, ReconciliationController.getBcpReconciliations);
router.get("/ibk-reconciliation/:id", authRequired, ReconciliationController.getIbkReconciliation);
router.get("/ibk-reconciliations", authRequired, ReconciliationController.getIbkReconciliations);


module.exports = router;
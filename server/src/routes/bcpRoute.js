const BcpController = require("../app/controllers/BcpController");
const router = require("express").Router();

// Middleware
const { authRequired } = require("../app/middlewares/validateToken");

router.get("/bcp/:id", authRequired, BcpController.getBcp);
router.get("/bcps", authRequired, BcpController.getBcps);
router.put("/bcp/:id", authRequired, BcpController.changeStatus);
router.put("/bcp/:id/observations", authRequired, BcpController.addObservations);

module.exports = router;

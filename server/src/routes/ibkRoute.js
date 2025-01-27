const IbkController = require("../app/controllers/IbkController");
const router = require("express").Router();

// Middleware
const { authRequired } = require("../app/middlewares/validateToken");

router.get("/ibk/:id", authRequired, IbkController.getIbk);
router.get("/ibks", authRequired, IbkController.getIbks);
router.put("/ibk/:id", authRequired, IbkController.changeStatus);
router.put("/ibk/:id/observations", authRequired, IbkController.addObservations);

module.exports = router;

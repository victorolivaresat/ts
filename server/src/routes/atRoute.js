const AtController = require("../app/controllers/AtController");
const router = require("express").Router();

// Middleware
const { authRequired } = require("../app/middlewares/validateToken");

router.get("/at/:id", authRequired, AtController.getAt);
router.get("/ats", authRequired, AtController.getAts);
router.put("/at/:id", authRequired, AtController.changeStatus);
router.put("/at/:id/observations", authRequired, AtController.addObservations);

module.exports = router;

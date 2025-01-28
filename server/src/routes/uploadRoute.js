const UploadController = require('../app/controllers/UploadController');
const multer  = require('multer')
const router = require('express').Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
const { authRequired  } = require('../app/middlewares/validateToken');

router.post("/upload-excel", authRequired, upload.single("file"), UploadController.uploadExcel);
router.get("/recent-notification-sums", authRequired, UploadController.getRecentNotificationSums);

module.exports = router;
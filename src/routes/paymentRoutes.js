const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, paymentController.createRazorpayOrder);
router.post("/verify", authMiddleware, paymentController.verifyPayment);
router.post("/webhook", authMiddleware, paymentController.webhook);

module.exports = router;

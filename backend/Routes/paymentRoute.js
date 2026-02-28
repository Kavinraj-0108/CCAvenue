const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");

router.post("/initiate/:id", paymentController.initiatePayment);
router.post("/response", paymentController.paymentResponse);

module.exports = router;
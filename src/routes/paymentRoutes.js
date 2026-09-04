const express = require("express");

const paymentController = require("../controllers/paymentController");

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Only admin can mark an order as paid
router.put(
  "/:id/mark-as-paid",
  authenticate,
  authorize("ADMIN"),
  paymentController.markOrderAsPaid
);

module.exports = router;

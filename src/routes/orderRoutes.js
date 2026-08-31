const express = require("express");

const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// All order routes require login
router.use(authenticate);

// Checkout
router.post("/checkout", orderController.checkout);

// Get all orders
router.get("/", orderController.getMyOrders);

// Cancel Order
router.put("/:id/cancel", orderController.cancelOrder);

// Get order By Id
router.get("/:id", orderController.getOrderById);

module.exports = router;

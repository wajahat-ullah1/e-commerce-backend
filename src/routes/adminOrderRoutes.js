const express = require("express");

const adminOrderController = require("../controllers/adminOrderController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// All routes require ADMIN access
router.use(authenticate);
router.use(authorize("ADMIN"));

// Get all orders
router.get("/", adminOrderController.getAllOrders);

// Update order status
router.put("/:id/status", adminOrderController.updateOrderStatus);

module.exports = router;

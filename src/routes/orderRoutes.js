const express = require("express");

const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// All order routes require login
router.use(authenticate);

// Checkout
router.post("/checkout", orderController.checkout);

// Get my orders
router.get("/", orderController.getMyOrders);

// Get one of my orders
router.get("/:id", orderController.getOrderById);

module.exports = router;

const express = require("express");

const inventoryController = require("../controllers/inventoryController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

// Get all inventory
router.get("/", inventoryController.getInventory);

// Get inventory statistics
router.get("/stats", inventoryController.getInventoryStats);

// Get low-stock products
router.get("/low-stock", inventoryController.getLowStockProducts);

// Get history of a product
router.get("/:productId/history", inventoryController.getInventoryHistory);

// Update product stock
router.put("/:productId/stock", inventoryController.updateStock);

// Receive stock for a product
router.post("/:productId/receive", inventoryController.receiveStock);

module.exports = router;

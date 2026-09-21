const express = require("express");
const adminController = require("../controllers/adminController");
const invoiceController = require("../controllers/invoiceController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get Admin Dashboard
router.get("/dashboard", authenticate, authorize("ADMIN"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

// Get All Customers
router.get(
  "/customers",
  authenticate,
  authorize("ADMIN"),
  adminController.getAllCustomers,
);

// Get all orders
router.get("/orders", adminController.getAllOrders);

// Update order status
router.put("/orders/:id/status", adminController.updateOrderStatus);

// Mark Order as Return
router.put("/:id/return", adminController.returnOrder);

// Get All Invoices
router.get("/invoices", invoiceController.getAllInvoices);

// Get Invoice by Id
router.get("/invoice/:id", invoiceController.getInvoiceById);

// Download Invoice By Id
router.get("/invoice/:id/pdf", invoiceController.downloadAdminInvoice);

module.exports = router;

const express = require("express");

const invoiceController = require("../controllers/invoiceController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/admin", invoiceController.getAllInvoices);

router.get("/admin/:id", invoiceController.getInvoiceById);

router.get("/admin/:id/pdf", invoiceController.downloadAdminInvoice);

module.exports = router;

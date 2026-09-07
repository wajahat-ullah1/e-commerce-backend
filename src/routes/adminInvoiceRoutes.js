const express = require("express");

const invoiceController = require("../controllers/invoiceController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", invoiceController.getAllInvoices);

router.get("/:id", invoiceController.getInvoiceById);

module.exports = router;

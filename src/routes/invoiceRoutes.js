const express = require("express");

const invoiceController = require("../controllers/invoiceController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/:id", invoiceController.getMyInvoice);

module.exports = router;

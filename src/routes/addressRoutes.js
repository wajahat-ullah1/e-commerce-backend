const express = require("express");

const addressController = require("../controllers/addressController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", addressController.createAddress);

module.exports = router;

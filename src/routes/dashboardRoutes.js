const express = require("express");

const dashboardController = require("../controllers/dashboardController");

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Only ADMIN can access dashboard
router.get(
  "/stats",
  authenticate,
  authorize("ADMIN"),
  dashboardController.getDashboardStats,
);

module.exports = router;

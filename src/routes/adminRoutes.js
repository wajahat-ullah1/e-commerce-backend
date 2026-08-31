const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;

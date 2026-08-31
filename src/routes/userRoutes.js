const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {

    res.json({
        success: true,
        message: "You accessed a protected route!",
        user: req.user
    });

});

module.exports = router;
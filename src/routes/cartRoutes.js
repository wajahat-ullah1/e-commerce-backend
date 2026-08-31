const express = require("express");

const cartController = require("../controllers/cartController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes require login
router.use(authenticate);

router.post("/add", cartController.addToCart);

router.get("/", cartController.getCart);

router.put("/:productId", cartController.updateCartItem);

router.delete("/:productId", cartController.removeFromCart);

module.exports = router;

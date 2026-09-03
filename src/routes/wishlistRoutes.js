const express = require("express");

const wishlistController = require("../controllers/wishlistController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/:productId", wishlistController.addToWishlist);
router.get("/", wishlistController.getWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

module.exports = router;

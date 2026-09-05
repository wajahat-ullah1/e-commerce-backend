const express = require("express");

const guestCartController = require("../controllers/guestCartController");

const router = express.Router();

// No authentication - these routes are for guest (not logged-in) users

router.post("/", guestCartController.createGuestCart);

router.get("/:guestCartId", guestCartController.getGuestCart);

router.post("/:guestCartId/add", guestCartController.addToGuestCart);

router.put("/:guestCartId/:productId", guestCartController.updateGuestCartItem);

router.delete(
  "/:guestCartId/:productId",
  guestCartController.removeFromGuestCart,
);

router.delete("/:guestCartId", guestCartController.clearGuestCart);

module.exports = router;

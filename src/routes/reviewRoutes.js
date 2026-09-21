const express = require("express");

const router = express.Router();

const {
  createReview,
  getAllReviews,
  getProductReviews,
  getProductRating,
  deleteReview,
} = require("../controllers/reviewController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const validate = require("../middleware/validateMiddleware");

const { createReviewSchema } = require("../validators/reviewValidator");

router.post(
  "/:productId",
  authenticate,
  validate(createReviewSchema),
  createReview,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllReviews,
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteReview,
);

router.get("/user/:productId", getProductReviews);

router.get("/rating/:productId", getProductRating);

module.exports = router;

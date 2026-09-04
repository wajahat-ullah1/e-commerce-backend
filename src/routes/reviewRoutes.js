const express = require("express");

const router = express.Router();

const {
  createReview,
  getProductReviews,
  getProductRating,
} = require("../controllers/reviewController");

const authenticate = require("../middleware/authMiddleware");

const validate = require("../middleware/validateMiddleware");

const { createReviewSchema } = require("../validators/reviewValidator");

router.post(
  "/:productId/reviews",
  authenticate,
  validate(createReviewSchema),
  createReview,
);

router.get("/:productId/reviews", getProductReviews);

router.get("/:productId/rating", getProductRating);

module.exports = router;

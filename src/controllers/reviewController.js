const reviewService = require("../services/reviewService");
const asyncHandler = require("../utils/asyncHandler");

const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  const review = await reviewService.createReview(
    req.user.id,
    productId,
    rating,
    comment,
  );

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
  });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await reviewService.getProductReviews(productId);

  res.status(200).json({
    success: true,
    reviews,
  });
});

const getProductRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const rating = await reviewService.getProductRating(productId);

  res.status(200).json({
    success: true,
    rating,
  });
});

module.exports = {
  createReview,
  getProductReviews,
  getProductRating
};

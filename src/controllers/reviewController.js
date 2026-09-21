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

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviews();
  res.status(200).json({
    success: true,
    reviews,
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

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id);
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  createReview,
  getAllReviews,
  getProductReviews,
  getProductRating,
  deleteReview,
};

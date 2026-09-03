const wishlistService = require("../services/wishlistService");
const asyncHandler = require("../utils/asyncHandler");

const addToWishlist = asyncHandler(async (req, res) => {
  const wishlistItem = await wishlistService.addToWishlist(
    req.user.id,
    req.params.productId,
  );

  res.status(201).json({
    success: true,
    message: "Product added to wishlist",
    wishlistItem,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await wishlistService.getWishlist(req.user.id);

  res.status(200).json({
    success: true,
    wishlistItems,
  });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlistItem = await wishlistService.removeFromWishlist(
    req.user.id,
    req.params.productId
  );

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlistItem,
  });
});

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};

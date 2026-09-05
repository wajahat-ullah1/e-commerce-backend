const guestCartService = require("../services/guestCartService");
const asyncHandler = require("../utils/asyncHandler");

const createGuestCart = asyncHandler(async (req, res) => {
  const guestCart = await guestCartService.createGuestCart();

  res.status(201).json({
    success: true,
    message: "Guest cart created",
    guestCart,
  });
});

const getGuestCart = asyncHandler(async (req, res) => {
  const guestCart = await guestCartService.getGuestCart(
    req.params.guestCartId,
  );

  res.status(200).json({
    success: true,
    guestCart,
  });
});

const addToGuestCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cartItem = await guestCartService.addToGuestCart(
    req.params.guestCartId,
    productId,
    quantity,
  );

  res.status(201).json({
    success: true,
    message: "Product added to guest cart",
    cartItem,
  });
});

const updateGuestCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartItem = await guestCartService.updateGuestCartItem(
    req.params.guestCartId,
    req.params.productId,
    quantity,
  );

  res.status(200).json({
    success: true,
    message: "Guest cart updated successfully",
    cartItem,
  });
});

const removeFromGuestCart = asyncHandler(async (req, res) => {
  const deletedProduct = await guestCartService.removeFromGuestCart(
    req.params.guestCartId,
    req.params.productId,
  );

  res.status(200).json({
    success: true,
    message: "Product removed from guest cart",
    product: deletedProduct,
  });
});

const clearGuestCart = asyncHandler(async (req, res) => {
  await guestCartService.clearGuestCart(req.params.guestCartId);

  res.status(200).json({
    success: true,
    message: "Guest cart cleared successfully",
  });
});

module.exports = {
  createGuestCart,
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
};

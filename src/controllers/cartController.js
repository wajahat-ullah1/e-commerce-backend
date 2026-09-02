const cartService = require("../services/cartService");
const asyncHandler = require("../utils/asyncHandler");

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

    const cartItem = await cartService.addToCart(
      req.user.id,
      productId,
      quantity,
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartItem,
    });
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);

    res.status(200).json({
      success: true,
      cart,
    });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

    const cartItem = await cartService.updateCartItem(
      req.user.id,
      req.params.productId,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartItem,
    });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const deleteproduct = await cartService.removeFromCart(
    req.user.id,
      req.params.productId,
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      product: deleteproduct,
    });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};

const cartService = require("../services/cartService");

async function addToCart(req, res) {
  try {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getCart(req, res) {
  try {
    const cart = await cartService.getCart(req.user.id);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateCartItem(req, res) {
  try {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function removeFromCart(req, res) {
  try {
    await cartService.removeFromCart(req.user.id, req.params.productId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};

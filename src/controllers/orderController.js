const orderService = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");

const checkout = asyncHandler(async (req, res) => {
  const { addressId } = req.body;

  const order = await orderService.createOrder(req.user.id, addressId);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);

  res.status(200).json({
    success: true,
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    order,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
};

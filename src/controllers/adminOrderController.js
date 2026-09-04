const orderService = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    success: true,
    orders,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

const returnOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await orderService.returnOrder(id);

  res.status(200).json({
    success: true,
    message: "Order marked as returned successfully",
    order,
  });
});

module.exports = {
  getAllOrders,
  updateOrderStatus,
  returnOrder,
};

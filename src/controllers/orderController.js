const orderService = require("../services/orderService");

async function checkout(req, res) {
  try {
    const order = await orderService.createOrder(req.user.id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await orderService.getMyOrders(req.user.id);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
};

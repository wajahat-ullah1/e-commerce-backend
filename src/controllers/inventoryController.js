const inventoryService = require("../services/inventoryService");
const asyncHandler = require("../utils/asyncHandler");

const updateStock = asyncHandler(async (req, res, next) => {
  const result = await inventoryService.updateStock(
    req.params.productId,
    req.body.stock,
    req.body.reason,
  );

  res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    data: result,
  });
});

const getInventory = asyncHandler(async (req, res, next) => {
  const inventory = await inventoryService.getInventory();

  res.status(200).json({
    success: true,
    data: inventory,
  });
});

const getInventoryHistory = asyncHandler(async (req, res, next) => {
  const result = await inventoryService.getInventoryHistory(
    req.params.productId,
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getLowStockProducts = asyncHandler(async (req, res, next) => {
  const products = await inventoryService.getLowStockProducts(
    req.query.threshold,
  );

  res.status(200).json({
    success: true,
    data: products,
  });
});

const receiveStock = asyncHandler(async (req, res, next) => {
  const result = await inventoryService.receiveStock(
    req.params.productId,
    req.body.quantity,
    req.body.reason,
  );

  res.status(200).json({
    success: true,
    message: "Stock received successfully",
    data: result,
  });
});

const getInventoryStats = asyncHandler(async (req, res, next) => {
  const stats = await inventoryService.getInventoryStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  updateStock,
  receiveStock,
  getInventory,
  getInventoryHistory,
  getLowStockProducts,
  getInventoryStats,
};

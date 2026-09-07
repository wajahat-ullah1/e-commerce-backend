const inventoryService = require("../services/inventoryService");

async function updateStock(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

async function getInventory(req, res, next) {
  try {
    const inventory = await inventoryService.getInventory();

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
}

async function getInventoryHistory(req, res, next) {
  try {
    const result = await inventoryService.getInventoryHistory(
      req.params.productId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getLowStockProducts(req, res, next) {
  try {
    const products = await inventoryService.getLowStockProducts(
      req.query.threshold,
    );

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

async function receiveStock(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

async function getInventoryStats(req, res, next) {
  try {
    const stats = await inventoryService.getInventoryStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateStock,
  receiveStock,
  getInventory,
  getInventoryHistory,
  getLowStockProducts,
  getInventoryStats,
};

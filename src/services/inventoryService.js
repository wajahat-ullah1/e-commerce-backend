const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function updateStock(productId, newStock, reason) {
  const id = Number(productId);
  const stock = Number(newStock);

  if (!Number.isInteger(stock) || stock < 0) {
    throw new AppError("Stock must be a non-negative integer", 400);
  }

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const previousStock = product.stock;

    if (previousStock === stock) {
      throw new AppError("New stock is same as current stock", 400);
    }

    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        stock,
      },
    });

    const history = await tx.inventoryHistory.create({
      data: {
        productId: id,
        previousStock,
        newStock: stock,
        quantity: stock - previousStock,
        action: "ADJUSTMENT",
        reason: reason || null,
      },
    });

    return {
      product: updatedProduct,
      history,
    };
  });
}

async function getInventory() {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      stock: "asc",
    },
  });
}

async function getInventoryHistory(productId) {
  const id = Number(productId);

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      stock: true,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const history = await prisma.inventoryHistory.findMany({
    where: {
      productId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    product,
    history,
  };
}

async function getLowStockProducts(threshold = 5) {
  const limit = Number(threshold);

  if (!Number.isInteger(limit) || limit < 0) {
    throw new AppError("Threshold must be a non-negative integer", 400);
  }

  return await prisma.product.findMany({
    where: {
      stock: {
        lte: limit,
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      stock: "asc",
    },
  });
}

// Helper function to record inventory history
async function recordInventoryHistory(
  tx,
  { productId, previousStock, newStock, quantity, action, reason = null },
) {
  return await tx.inventoryHistory.create({
    data: {
      productId,
      previousStock,
      newStock,
      quantity,
      action,
      reason,
    },
  });
}

async function receiveStock(productId, quantity, reason) {
  const id = Number(productId);
  const amount = Number(quantity);

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new AppError("Quantity must be a positive integer", 400);
  }

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const previousStock = product.stock;
    const newStock = previousStock + amount;

    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        stock: newStock,
      },
    });

    const history = await tx.inventoryHistory.create({
      data: {
        productId: id,
        previousStock,
        newStock,
        quantity: amount,
        action: "PURCHASE",
        reason: reason || "Stock received",
      },
    });

    return {
      product: updatedProduct,
      history,
    };
  });
}

async function getInventoryStats() {
  const products = await prisma.product.findMany({
    select: {
      stock: true,
    },
  });

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const outOfStock = products.filter((product) => product.stock === 0).length;

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  return {
    totalProducts,
    totalStock,
    outOfStock,
    lowStock,
  };
}

module.exports = {
  updateStock,
  receiveStock,
  getInventory,
  getInventoryHistory,
  getLowStockProducts,
  getInventoryStats,
  recordInventoryHistory,
};

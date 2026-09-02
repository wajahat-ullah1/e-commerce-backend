const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

async function addToCart(userId, productId, quantity = 1) {
  logger.info("Add To Cart Endpoint Hit..");
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Find user's cart
  let cart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  // Create cart if it doesn't exist
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: Number(userId),
      },
    });
  }

  // Check if product is already in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: Number(productId),
      },
    },
  });

  // If product already exists, increase quantity
  if (existingCartItem) {
    logger.info("Item Added to Cart Successfully..");
    return await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: {
          increment: Number(quantity),
        },
      },
    });
  }

  // Otherwise create new cart item
  logger.info("Item Added to Cart Successfully..");
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: Number(productId),
      quantity: Number(quantity),
    },
  });

  // try {
  // } catch (error) {
  //   logger.error("Adding To Cart Error:", error.message);
  //   throw error;
  // }
}

async function getCart(userId) {
  logger.info("Get Cart By User Id Endpoint Hit..");
  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  logger.info("Cart Fetched Successfully..");

  return cart;
  // try {
  // } catch (error) {
  //   logger.error("Getting Cart Error:", error.message);
  //   throw error;
  // }
}

async function updateCartItem(userId, productId, quantity) {
  logger.info("Update Cart Item By User Id Endpoint Hit..");
  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: Number(productId),
      },
    },
  });

  if (!cartItem) {
    throw new AppError("Product is not in your cart", 404);
  }

  logger.info("Product Updated Successfully..");
  return await prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },
    data: {
      quantity: Number(quantity),
    },
  });
  // try {
  // } catch (error) {
  //   logger.error("Getting Cart Item Error:", error.message);
  //   throw error;
  // }
}

async function removeFromCart(userId, productId) {
  logger.info("Remove Cart Item By User Id Endpoint Hit..");
  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: Number(productId),
      },
    },
  });

  if (!cartItem) {
    throw new AppError("Product is not in your cart", 404);
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItem.id,
    },
  });
  logger.info("Product Removed Successfully..");

  return true;
  // try {
  // } catch (error) {
  //   logger.error("Removing From Cart Error:", error.message);
  //   throw error;
  // }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};

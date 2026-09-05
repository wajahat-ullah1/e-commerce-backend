const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

async function createGuestCart() {
  logger.info("Create Guest Cart Endpoint Hit..");

  const guestCart = await prisma.guestCart.create({
    data: {},
  });

  logger.info("Guest Cart Created Successfully..");
  return guestCart;
}

async function getGuestCart(guestCartId) {
  logger.info("Get Guest Cart By Id Endpoint Hit..");

  const guestCart = await prisma.guestCart.findUnique({
    where: {
      id: guestCartId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!guestCart) {
    throw new AppError("Guest cart not found", 404);
  }

  logger.info("Guest Cart Fetched Successfully..");
  return guestCart;
}

async function addToGuestCart(guestCartId, productId, quantity = 1) {
  logger.info("Add To Guest Cart Endpoint Hit..");

  // Guest cart must already exist (created via POST /api/guest-cart)
  const guestCart = await prisma.guestCart.findUnique({
    where: {
      id: guestCartId,
    },
  });

  if (!guestCart) {
    throw new AppError(
      "Guest cart not found. Please create a guest cart first.",
      404,
    );
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if product is already in guest cart
  const existingItem = await prisma.guestCartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: guestCartId,
        productId: Number(productId),
      },
    },
  });

  // If product already exists, increase quantity
  if (existingItem) {
    logger.info("Guest Cart Item Quantity Increased Successfully..");
    return await prisma.guestCartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: Number(quantity),
        },
      },
    });
  }

  // Otherwise create new guest cart item
  logger.info("Item Added to Guest Cart Successfully..");
  return await prisma.guestCartItem.create({
    data: {
      cartId: guestCartId,
      productId: Number(productId),
      quantity: Number(quantity),
    },
  });
}

async function updateGuestCartItem(guestCartId, productId, quantity) {
  logger.info("Update Guest Cart Item Endpoint Hit..");

  const guestCart = await prisma.guestCart.findUnique({
    where: {
      id: guestCartId,
    },
  });

  if (!guestCart) {
    throw new AppError("Guest cart not found", 404);
  }

  const cartItem = await prisma.guestCartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: guestCartId,
        productId: Number(productId),
      },
    },
  });

  if (!cartItem) {
    throw new AppError("Product is not in your guest cart", 404);
  }

  logger.info("Guest Cart Item Updated Successfully..");
  return await prisma.guestCartItem.update({
    where: {
      id: cartItem.id,
    },
    data: {
      quantity: Number(quantity),
    },
  });
}

async function removeFromGuestCart(guestCartId, productId) {
  logger.info("Remove Guest Cart Item Endpoint Hit..");

  const guestCart = await prisma.guestCart.findUnique({
    where: {
      id: guestCartId,
    },
  });

  if (!guestCart) {
    throw new AppError("Guest cart not found", 404);
  }

  const cartItem = await prisma.guestCartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: guestCartId,
        productId: Number(productId),
      },
    },
  });

  if (!cartItem) {
    throw new AppError("Product is not in your guest cart", 404);
  }

  await prisma.guestCartItem.delete({
    where: {
      id: cartItem.id,
    },
  });

  logger.info("Guest Cart Item Removed Successfully..");
  return true;
}

async function clearGuestCart(guestCartId) {
  logger.info("Clear Guest Cart Endpoint Hit..");

  const guestCart = await prisma.guestCart.findUnique({
    where: {
      id: guestCartId,
    },
  });

  if (!guestCart) {
    throw new AppError("Guest cart not found", 404);
  }

  await prisma.guestCartItem.deleteMany({
    where: {
      cartId: guestCartId,
    },
  });

  logger.info("Guest Cart Cleared Successfully..");
  return true;
}

module.exports = {
  createGuestCart,
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
};

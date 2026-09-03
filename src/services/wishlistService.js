const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const addToWishlist = async (userId, productId) => {
  logger.info(`Adding product ${productId} to wishlist for user ${userId}`);
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });

  if (existingItem) {
    throw new AppError("Product is already in your wishlist", 409);
  }

  const wishlistItem = await prisma.wishlistItem.create({
    data: {
      userId: Number(userId),
      productId: Number(productId),
    },
    include: {
      product: true,
    },
  });
  logger.info(`Product ${productId} added to wishlist for user ${userId}`);
  return wishlistItem;
};

const getWishlist = async (userId) => {
  logger.info(`Fetching wishlist for user ${userId}`);
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      product: true,
    },
  });
  return wishlistItems;
};

const removeFromWishlist = async (userId, productId) => {
  logger.info(`Removing product ${productId} from wishlist for user ${userId}`);
  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });

  if (!existingItem) {
    throw new AppError("Product is not in your wishlist", 404);
  }

  const wishlistItem = await prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });
  logger.info(`Product ${productId} removed from wishlist for user ${userId}`);
  return wishlistItem;
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};

const { log } = require("winston");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const createReview = async (userId, productId, rating, comment) => {
  logger.info(`Creating review for product ${productId} by user ${userId}`);
  // 1. Check if product exists
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // 2. Check if user has purchased this product
  const deliveredOrder = await prisma.order.findFirst({
    where: {
      userId: Number(userId),
      status: "DELIVERED",
      items: {
        some: {
          productId: Number(productId),
        },
      },
    },
  });

  if (!deliveredOrder) {
    throw new AppError(
      "You can only review products from delivered orders",
      403,
    );
  }

  // 3. Check if user has already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this product", 409);
  }

  // 4. Create review
  const review = await prisma.review.create({
    data: {
      userId: Number(userId),
      productId: Number(productId),
      rating: Number(rating),
      comment,
    },
  });
  logger.info(
    `Review created successfully for product ${productId} by user ${userId}`,
  );
  return review;
};

const getProductReviews = async (productId) => {
  logger.info(`Fetching reviews for product ${productId}`);
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId: Number(productId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  logger.info(`Fetched ${reviews.length} reviews for product ${productId}`);
  return reviews;
};

const getProductRating = async (productId) => {
    logger.info(`Calculating average rating for product ${productId}`);
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const result = await prisma.review.aggregate({
    where: {
      productId: Number(productId),
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });
  logger.info(`Average rating for product ${productId} is ${result._avg.rating}, total reviews: ${result._count.rating}`);
  return {
    productId: Number(productId),
    averageRating: result._avg.rating
      ? Number(result._avg.rating.toFixed(1))
      : 0,
    totalReviews: result._count.rating,
  };
};

module.exports = {
  createReview,
  getProductReviews,
  getProductRating,
};

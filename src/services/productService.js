const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const reviewService = require("./reviewService");
const AppError = require("../utils/AppError");

const IMAGE_ORDER = { orderBy: { position: "asc" } };

function withPrimaryImage(product) {
  if (!product) return product;
  return { ...product, image: product.images?.[0]?.url ?? null };
}

async function createProduct(data, images = []) {
  logger.info("Create Product Endpoint Hit..");

  const newproduct = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: Number(data.stock),
      categoryId: Number(data.categoryId),
      images: {
        create: images.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          position: i,
        })),
      },
    },
    include: { images: IMAGE_ORDER, category: true },
  });

  logger.info("Product Created Successfully..");
  return withPrimaryImage(newproduct);
}

async function getProducts(query) {
  logger.info("Get Products Endpoint Hit..");
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort,
  } = query;

  const where = {};

  // Search by product name
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Filter by category
  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  // Filter by price
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  // Pagination
  const currentPage = Number(page);
  const pageLimit = Number(limit);

  const skip = (currentPage - 1) * pageLimit;

  // Sorting
  let orderBy = {
    createdAt: "desc",
  };

  if (sort === "price_asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price_desc") {
    orderBy = {
      price: "desc",
    };
  }

  if (sort === "oldest") {
    orderBy = {
      createdAt: "asc",
    };
  }

  // Get products + total count
  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: IMAGE_ORDER },
      orderBy,
      skip,
      take: pageLimit,
    }),

    prisma.product.count({ where }),
  ]);

  const ratings = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: products.map((p) => p.id) } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const ratingMap = new Map(ratings.map((r) => [r.productId, r]));

  const productsWithRating = products.map((product) => {
    const r = ratingMap.get(product.id);
    return {
      ...withPrimaryImage(product),
      rating: r?._avg.rating ? Number(r._avg.rating.toFixed(1)) : 0,
      totalReviews: r?._count.rating || 0,
    };
  });

  logger.info("Products Fetched Successfully..");

  return {
    products: productsWithRating,
    pagination: {
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageLimit),
      limit: pageLimit,
    },
  };
}

async function getProductById(id) {
  logger.info("Get Product By Id Endpoint Hit..");
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      category: true,
      images: IMAGE_ORDER,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const { averageRating, totalReviews } =
    await reviewService.getProductRating(id);

  logger.info("Product Fetched Successfully..");
  return { ...withPrimaryImage(product), rating: averageRating, totalReviews };
}

async function updateProduct(id, data, imageChanges = {}) {
  logger.info("Update Product By Id Endpoint Hit..");

  const productId = Number(id);
  const { imageOrder = null, newImages = [] } = imageChanges;

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  let orderedTargets = null;
  let deletedImages = [];

  if (imageOrder) {
    const existingById = new Map(
      existing.images.map((img) => [String(img.id), img]),
    );

    let newIdx = 0;
    orderedTargets = imageOrder
      .map((token) => {
        if (token === "new") {
          const img = newImages[newIdx++];
          return img
            ? { kind: "new", url: img.url, publicId: img.publicId }
            : null;
        }
        const row = existingById.get(String(token));
        return row ? { kind: "existing", row } : null;
      })
      .filter(Boolean);

    const keptIds = new Set(
      orderedTargets.filter((t) => t.kind === "existing").map((t) => t.row.id),
    );
    deletedImages = existing.images.filter((img) => !keptIds.has(img.id));
  }

  const product = await prisma.$transaction(async (tx) => {
    if (orderedTargets) {
      if (deletedImages.length) {
        await tx.productImage.deleteMany({
          where: { id: { in: deletedImages.map((img) => img.id) } },
        });
      }

      await Promise.all(
        orderedTargets.map((t, i) =>
          t.kind === "existing"
            ? tx.productImage.update({
                where: { id: t.row.id },
                data: { position: i },
              })
            : tx.productImage.create({
                data: {
                  productId,
                  url: t.url,
                  publicId: t.publicId,
                  position: i,
                },
              }),
        ),
      );
    }

    return tx.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: Number(data.stock),
        categoryId: Number(data.categoryId),
      },
      include: { images: IMAGE_ORDER, category: true },
    });
  });

  logger.info("Product Updated Successfully..");
  return { product: withPrimaryImage(product), deletedImages };
}

async function deleteProduct(id) {
  logger.info("Delete Product By Id Endpoint Hit..");

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Cascades and removes the ProductImage rows too (onDelete: Cascade).
  await prisma.product.delete({
    where: { id: Number(id) },
  });

  logger.info("Product Deleted Successfully..");
  return product;
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

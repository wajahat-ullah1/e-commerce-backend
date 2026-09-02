const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

async function createProduct(data) {
  logger.info("Create Product Endpoint Hit..");

  const newproduct = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: Number(data.stock),
      image: data.image,
      imagePublicId: data.imagePublicId,
      categoryId: Number(data.categoryId),
    },
  });

  logger.info("Product Created Successfully..");
  return newproduct;
  // try {
  // } catch (error) {
  //   logger.error("Creating Product Error:", error.message);
  //   throw error;
  // }
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
      include: {
        category: true,
      },
      orderBy,
      skip,
      take: pageLimit,
    }),

    prisma.product.count({
      where,
    }),
  ]);
  logger.info("Products Fetched Successfully..");

  return {
    products,
    pagination: {
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageLimit),
      limit: pageLimit,
    },
  };
  // try {
  // } catch (error) {
  //   logger.error("Fetching Products Error:", error.message);
  //   throw error;
  // }
}

async function getProductById(id) {
  logger.info("Get Product By Id Endpoint Hit..");
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  logger.info("Product Fetched Successfully..");
  return product;
  // try {
  // } catch (error) {
  //   logger.error("Fetching Products Error:", error.message);
  //   throw error;
  // }
}

async function updateProduct(id, data) {
  logger.info("Update Product By Id Endpoint Hit..");
  const product = await prisma.product.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: Number(data.stock),
      image: data.image,
      imagePublicId: data.imagePublicId,
      categoryId: Number(data.categoryId),
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  logger.info("Product Updated Successfully..");
  return product;
  // try {
  // } catch (error) {
  //   logger.error("Updating Product Error:", error.message);
  //   throw error;
  // }
}

async function deleteProduct(id) {
  logger.info("Delete Product By Id Endpoint Hit..");
  const product = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  logger.info("Product Deleted Successfully..");
  return product;
  // try {
  // } catch (error) {
  //   logger.error("Deleting Products Error:", error.message);
  //   throw error;
  // }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

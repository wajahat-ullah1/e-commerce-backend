const prisma = require("../config/prisma");
const logger = require("../utils/logger");

async function createProduct(data) {
  try {
    logger.info("Create Product Endpoint Hit..");

    const newproduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image,
        categoryId: Number(data.categoryId),
      },
    });

    logger.info("Product Created Successfully..");
    return newproduct;
  } catch (error) {
    logger.error("Creating Product Error:", error.message);
    throw error;
  }
}

async function getProducts() {
  try {
    logger.info("Get All Products Endpoint Hit..");
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    logger.info("Products Fetched Successfully..");
    return products;
  } catch (error) {
    logger.error("Fetching Products Error:", error.message);
    throw error;
  }
}

async function getProductById(id) {
  try {
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
      throw new Error("Product not found");
    }

    logger.info("Product Fetched Successfully..");
    return product;
  } catch (error) {
    logger.error("Fetching Products Error:", error.message);
    throw error;
  }
}

async function updateProduct(id, data) {
  try {
    logger.info("Update Product By Id Endpoint Hit..");
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image,
        categoryId: Number(data.categoryId),
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    logger.info("Product Updated Successfully..");
    return product;
  } catch (error) {
    logger.error("Updating Product Error:", error.message);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    logger.info("Delete Product By Id Endpoint Hit..");
    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    logger.info("Product Deleted Successfully..");
    return product;
  } catch (error) {
    logger.error("Deleting Products Error:", error.message);
    throw error;
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

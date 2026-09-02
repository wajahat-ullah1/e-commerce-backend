const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

async function createCategory(name) {
  logger.info("Create Category Endpoint Hit..");
  // Check if Category already exists
  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new AppError("Category already exists", 404);
  }

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  logger.info("Category Created Successfully..");
  return category;
  // try {
  // } catch (error) {
  //   logger.error("Creating Category Error:", error.message);
  //   throw error;
  // }
}

async function getCategories() {
  logger.info("Get Categories Endpoint Hit..");
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  logger.info("Categories Fetched Successfully..");
  return categories;
  // try {
  // } catch (error) {
  //   logger.error("Fetching Category Error:", error.message);
  //   throw error;
  // }
}

async function updateCategory(id, name) {
  logger.info("Update Category Endpoint Hit..");
  const category = await prisma.category.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  logger.info("Category Updated Successfully");

  return category;
  // try {
  // } catch (error) {
  //   logger.error("Update Category Error:", error.message);
  //   throw error;
  // }
}

async function deleteCategory(id) {
  logger.info("Delete Category Endpoint Hit..");
  const category = await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  logger.info("Category Deleted Successfully");
  return category;
  // try {
  // } catch (error) {
  //   logger.error("Delete Category Error:", error.message);
  //   throw error;
  // }
}
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

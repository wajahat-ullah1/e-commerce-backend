const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");
const uploadService = require("./uploadService");

async function createCategory(name, image = null) {
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
      image: image?.secure_url ?? null,
      imagePublicId: image?.public_id ?? null,
    },
  });

  logger.info("Category Created Successfully..");
  return category;
}

async function getCategories() {
  logger.info("Get Categories Endpoint Hit..");
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
  logger.info("Categories Fetched Successfully..");
  return categories;
}

async function updateCategory(id, name, image = null) {
  logger.info("Update Category Endpoint Hit..");

  const existing = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  const data = { name };

  // Only touch the image columns when a new file was actually uploaded —
  // otherwise leave whatever image the category already has untouched.
  // If it did replace an image, hand the old Cloudinary publicId back to
  // the caller so it can be deleted only after this update commits.
  let deletedImagePublicId = null;
  if (image) {
    data.image = image.secure_url;
    data.imagePublicId = image.public_id;
    deletedImagePublicId = existing.imagePublicId || null;
  }

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data,
  });

  logger.info("Category Updated Successfully");

  return { category, deletedImagePublicId };
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

  if (category.imagePublicId) {
    await uploadService.deleteImage(category.imagePublicId);
  }

  logger.info("Category Deleted Successfully");
  return category;
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
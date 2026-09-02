const categoryService = require("../services/categoryService");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await categoryService.createCategory(name);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.status(200).json({
    success: true,
    categories,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await categoryService.updateCategory(id, name);

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await categoryService.deleteCategory(id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

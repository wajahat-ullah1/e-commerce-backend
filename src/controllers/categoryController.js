const categoryService = require("../services/categoryService");

async function createCategory(req, res) {
  try {
    const { name } = req.body;

    const category = await categoryService.createCategory(name);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await categoryService.getCategories();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await categoryService.updateCategory(id, name);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

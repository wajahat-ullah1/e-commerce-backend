const express = require("express");

const categoryController = require("../controllers/categoryController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const validate = require("../middleware/validateMiddleware");
const { categorySchema } = require("../validators/categoryValidator");

const router = express.Router();

// Public - Everyone can see categories
router.get("/", categoryController.getCategories);

// Admin only - Create category
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(categorySchema),
  categoryController.createCategory,
);

// Admin only - Update category
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(categorySchema),
  categoryController.updateCategory,
);

// Admin only - Delete category
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.deleteCategory,
);

module.exports = router;

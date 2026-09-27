const express = require("express");

const categoryController = require("../controllers/categoryController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const validate = require("../middleware/validateMiddleware");
const { categorySchema } = require("../validators/categoryValidator");

const router = express.Router();

// Public - Everyone can see categories
router.get("/", categoryController.getCategories);

// Admin only - Create category
// upload.single runs before validate so multer has parsed the multipart
// body (including the "name" text field) into req.body by the time Joi
// checks it, and the file itself lands on req.file.
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
  validate(categorySchema),
  categoryController.createCategory,
);

// Admin only - Update category
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
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
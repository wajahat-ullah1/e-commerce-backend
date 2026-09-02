const express = require("express");

const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const validate = require("../middleware/validateMiddleware");
const { createProductSchema } = require("../validators/productValidator");

const router = express.Router();

// Public routes
router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
  validate(createProductSchema),
  productController.createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.single("image"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.deleteProduct,
);

module.exports = router;

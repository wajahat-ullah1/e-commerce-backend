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

// Must come before "/:id" so it isn't matched as a product id.
router.get("/best-sellers", productController.getBestSellers);

router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  upload.array("images", 8),
  validate(createProductSchema),
  productController.createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  upload.array("images", 8),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.deleteProduct,
);

module.exports = router;

const express = require("express");

const productController = require("../controllers/productController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  productController.createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.deleteProduct,
);

module.exports = router;

const productService = require("../services/productService");
const uploadService = require("../services/uploadService");
const asyncHandler = require("../utils/asyncHandler");

async function createProduct(req, res) {
  let uploadedImages = [];

  try {
    const files = req.files || [];

    if (files.length) {
      uploadedImages = await Promise.all(
        files.map((file) => uploadService.uploadImage(file.buffer)),
      );
    }

    const images = uploadedImages.map((img) => ({
      url: img.secure_url,
      publicId: img.public_id,
    }));

    const product = await productService.createProduct(req.body, images);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    // If database creation fails after image upload(s),
    // delete the uploaded images
    if (uploadedImages.length) {
      await Promise.all(
        uploadedImages.map((img) => uploadService.deleteImage(img.public_id)),
      );
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    product,
  });
});

async function updateProduct(req, res) {
  let uploadedImages = [];

  try {
    const files = req.files || [];

    // The admin submits the ids of existing images it wants to keep, in the
    // desired order, as a JSON array string — e.g. existingImages="[12,15]".
    // Anything already on the product but missing from this list is treated
    // as removed.
    let keepImageIds = [];
    if (req.body.existingImages) {
      try {
        keepImageIds = JSON.parse(req.body.existingImages);
      } catch {
        keepImageIds = [];
      }
    }

    if (files.length) {
      uploadedImages = await Promise.all(
        files.map((file) => uploadService.uploadImage(file.buffer)),
      );
    }

    const newImages = uploadedImages.map((img) => ({
      url: img.secure_url,
      publicId: img.public_id,
    }));

    const { product, deletedImages } = await productService.updateProduct(
      req.params.id,
      req.body,
      { keepImageIds, newImages },
    );

    // Only clean up Cloudinary once the DB update has actually committed.
    if (deletedImages.length) {
      await Promise.all(
        deletedImages.map((img) => uploadService.deleteImage(img.publicId)),
      );
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    // Delete newly uploaded images if something failed
    if (uploadedImages.length) {
      await Promise.all(
        uploadedImages.map((img) => uploadService.deleteImage(img.public_id)),
      );
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

const deleteProduct = asyncHandler(async (req, res) => {
  // Find the product first
  const product = await productService.getProductById(req.params.id);

  // Delete product from database
  try {
    await productService.deleteProduct(req.params.id);
  } catch (error) {
    if (
      error.message?.includes("foreign key constraint") ||
      error.message?.includes("RESTRICT")
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This product can't be deleted because it has existing orders.",
      });
    }
    throw error;
  }

  // Delete images from Cloudinary
  if (product.images?.length) {
    await Promise.all(
      product.images.map((img) => uploadService.deleteImage(img.publicId)),
    );
  }

  res.status(200).json({
    success: true,
    message: "Product and images deleted successfully",
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

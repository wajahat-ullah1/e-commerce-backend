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

    // On create every token is "new" (there are no existing images yet),
    // consumed in upload order — mirrors the update flow's imageOrder logic.
    let imageOrder = null;
    if (req.body.imageOrder) {
      try {
        imageOrder = JSON.parse(req.body.imageOrder);
      } catch {
        imageOrder = null;
      }
    }

    const newImages = uploadedImages.map((img) => ({
      url: img.secure_url,
      publicId: img.public_id,
    }));

    let orderedImages = newImages;
    if (imageOrder) {
      let idx = 0;
      orderedImages = imageOrder
        .map((token) => (token === "new" ? newImages[idx++] : null))
        .filter(Boolean);
    }

    const product = await productService.createProduct(req.body, orderedImages);

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

    // The admin's gallery UI submits the full desired order as a JSON array
    // of tokens — an existing image's id (string) to keep it in that slot,
    // or the literal "new" to consume the next freshly-uploaded file, in
    // upload order. e.g. imageOrder = '["new","12","15"]' means: the new
    // upload goes first, then existing images 12 and 15. Omitted entirely
    // (admin never touched the gallery) leaves existing images untouched.
    let imageOrder = null;
    if (req.body.imageOrder) {
      try {
        imageOrder = JSON.parse(req.body.imageOrder);
      } catch {
        imageOrder = null;
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
      { imageOrder, newImages },
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

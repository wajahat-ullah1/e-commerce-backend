const productService = require("../services/productService");
const uploadService = require("../services/uploadService");
const asyncHandler = require("../utils/asyncHandler");

async function createProduct(req, res) {
  let uploadedImage;

  try {
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      uploadedImage = await uploadService.uploadImage(req.file.buffer);

      imageUrl = uploadedImage.secure_url;
      imagePublicId = uploadedImage.public_id;
    }

    const productData = {
      ...req.body,
      image: imageUrl,
      imagePublicId,
    };

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    // If database creation fails after image upload,
    // delete the uploaded image
    if (uploadedImage?.public_id) {
      await uploadService.deleteImage(uploadedImage.public_id);
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
  let uploadedImage;

  try {
    const existingProduct = await productService.getProductById(req.params.id);

    const productData = {
      ...req.body,
      image: existingProduct.image,
      imagePublicId: existingProduct.imagePublicId,
    };

    // If admin uploaded a new image
    if (req.file) {
      uploadedImage = await uploadService.uploadImage(req.file.buffer);

      productData.image = uploadedImage.secure_url;
      productData.imagePublicId = uploadedImage.public_id;
    }

    const product = await productService.updateProduct(
      req.params.id,
      productData,
    );

    // Delete old image AFTER successful database update
    if (req.file && existingProduct.imagePublicId) {
      await uploadService.deleteImage(existingProduct.imagePublicId);
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    // Delete newly uploaded image if something failed
    if (uploadedImage?.public_id) {
      await uploadService.deleteImage(uploadedImage.public_id);
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

    // Delete image from Cloudinary
    if (product.imagePublicId) {
      await uploadService.deleteImage(product.imagePublicId);
    }

    // Delete product from database
    await productService.deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product and image deleted successfully",
    });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

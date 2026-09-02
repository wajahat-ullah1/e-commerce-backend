const cloudinary = require("../config/cloudinary");
const logger = require("../utils/logger");

function uploadImage(buffer) {
  logger.info("Upload Image Endoint Hit..");
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          logger.info("Image Uploaded Successfully..");
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
}

async function deleteImage(publicId) {
  logger.info("Delete Image Endoint Hit..");

  if (!publicId) return;

  logger.info("Image Deleted Successfully..");
  await cloudinary.uploader.destroy(publicId);
}

module.exports = {
  uploadImage,
  deleteImage,
};

const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");
const uploadService = require("../services/uploadService");
const AppError = require("../utils/AppError");

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getMyProfile(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateMyProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please upload an image", 400);
  }

  const user = await userService.getMyProfile(req.user.id);

  // Delete old image from Cloudinary
  if (user.profileImagePublicId) {
    await uploadService.deleteImage(user.profileImagePublicId);
  }

  // Upload new image
  const uploadedImage = await uploadService.uploadImage(req.file.buffer);

  const updatedUser = await userService.updateProfileImage(
    req.user.id,
    uploadedImage.secure_url,
    uploadedImage.public_id,
  );

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    user: updatedUser,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
};

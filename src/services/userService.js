const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

const getMyProfile = async (userId) => {
  logger.info(`Fetching profile for user ID: ${userId}`);
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    logger.error("User not found");
    throw new AppError("User not found", 404);
  }

  logger.info(`Profile fetched for user ID: ${userId}`);
  return user;
};

const updateMyProfile = async (userId, data) => {
  logger.info(`Updating profile for user ID: ${userId}`);
  const user = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      name: data.name,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  logger.info(`Profile updated for user ID: ${userId}`);
  return user;
};

const updateProfileImage = async (userId, imageUrl, publicId) => {
  const user = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      profileImage: imageUrl,
      profileImagePublicId: publicId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      profileImage: true,
    },
  });

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify current password
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError("Current password is incorrect", 401);
  }

  // Prevent using the same password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      password: hashedPassword,
      tokenVersion: {
        increment: 1,
      },
    },
  });
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  changePassword,
};

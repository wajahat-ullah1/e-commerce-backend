const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const createAddress = async (userId, data) => {
  logger.info(`Creating address for user ID: ${userId}`);
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = data;

  // Check if user already has addresses
  const addressCount = await prisma.address.count({
    where: {
      userId: Number(userId),
    },
  });

  // First address should automatically become default
  const shouldBeDefault = addressCount === 0 || isDefault === true;

  // If this address is default, remove default from existing addresses
  if (shouldBeDefault) {
    await prisma.address.updateMany({
      where: {
        userId: Number(userId),
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: Number(userId),
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault: shouldBeDefault,
    },
  });
  logger.info(
    `Address created for user ID: ${userId} with address ID: ${address.id}`,
  );
  return address;
};

module.exports = {
  createAddress,
};

const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const createAddress = async (userId, data) => {
  logger.info(`Creating address for user ID: ${userId}`);

  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = data;

  const numericUserId = Number(userId);

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: numericUserId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if the same address already exists for this user
  const existingAddress = await prisma.address.findFirst({
    where: {
      userId: numericUserId,
      addressLine1,
      addressLine2: addressLine2 ?? null,
      city,
      state: state ?? null,
      postalCode,
      country,
    },
  });

  if (existingAddress) {
    throw new AppError("This address already exists", 409);
  }

  // Check if user already has addresses
  const addressCount = await prisma.address.count({
    where: {
      userId: numericUserId,
    },
  });

  // First address should automatically become default
  const shouldBeDefault = addressCount === 0 || isDefault === true;

  // If this address is default, remove default from existing addresses
  if (shouldBeDefault) {
    await prisma.address.updateMany({
      where: {
        userId: numericUserId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: numericUserId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault: shouldBeDefault,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
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

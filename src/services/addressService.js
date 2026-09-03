const { log } = require("winston");
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

  // Create address
  let address;

  try {
    address = await prisma.address.create({
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
  } catch (error) {
    // Database-level duplicate protection
    if (error.code === "P2002") {
      throw new AppError("This address already exists", 409);
    }

    // Pass unexpected errors to the global error handler
    throw error;
  }

  logger.info(
    `Address created for user ID: ${userId} with address ID: ${address.id}`,
  );

  return address;
};

const getMyAddresses = async (userId) => {
  logger.info(`Fetching addresses for user ID: ${userId}`);
  const addresses = await prisma.address.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
  logger.info(`Fetched ${addresses.length} addresses for user ID: ${userId}`);
  return addresses;
};

const updateAddress = async (userId, addressId, data) => {
  logger.info(`Updating address for ID: ${addressId} for user ID: ${userId}`);
  const address = await prisma.address.findFirst({
    where: {
      id: Number(addressId),
      userId: Number(userId),
    },
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = data;

  // If making this address default,
  // remove default from the user's other addresses
  if (isDefault === true) {
    await prisma.address.updateMany({
      where: {
        userId: Number(userId),
        id: {
          not: Number(addressId),
        },
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  const updatedAddress = await prisma.address.update({
    where: {
      id: Number(addressId),
    },
    data: {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      ...(isDefault !== undefined && {
        isDefault,
      }),
    },
  });
  logger.info(`Address with ID: ${addressId} updated for user ID: ${userId}`);
  return updatedAddress;
};

const deleteAddress = async (userId, addressId) => {
  logger.info(`Deleting address with ID: ${addressId} for user ID: ${userId}`);
  const address = await prisma.address.findFirst({
    where: {
      id: Number(addressId),
      userId: Number(userId),
    },
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  await prisma.address.delete({
    where: {
      id: Number(addressId),
    },
  });
  logger.info(`Address with ID: ${addressId} deleted for user ID: ${userId}`);
};

const setDefaultAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: Number(addressId),
      userId: Number(userId),
    },
  });

  if (!address) {
    throw new AppError("Address not found", 404);
  }

  // Remove default from all other addresses
  await prisma.address.updateMany({
    where: {
      userId: Number(userId),
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  });

  // Make selected address default
  const updatedAddress = await prisma.address.update({
    where: {
      id: Number(addressId),
    },
    data: {
      isDefault: true,
    },
  });

  return updatedAddress;
};

module.exports = {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

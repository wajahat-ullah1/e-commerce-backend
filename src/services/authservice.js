const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");
const cartService = require("./cartService");

async function registerUser({ name, email, phone, password }) {
  logger.info("Register User Endpoint Hit..");
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("User already exists", 404);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: "CUSTOMER",
    },

    // Don't return password
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  logger.info("User Registered Successfully..");

  return user;
  // try {
  // } catch (error) {
  //   logger.error("Register User Error:", error.message);
  //   throw error;
  // }
}

async function loginUser({ email, password }) {
  logger.info("Login User Endpoint Hit..");
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 404);
  }

  // Compare entered password with hashed password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 404);
  }

  logger.info("User Logged In Successfully..");

  return user;
  // try {
  // } catch (error) {
  //   logger.error("Login User Error:", error.message);
  //   throw error;
  // }
}

// Create an account for a guest who just checked out, using the contact
// info already collected on their order, then link past guest orders and
// merge any leftover guest cart into the new account.
async function registerFromGuestOrder({ orderId, guestCartId, password }) {
  logger.info("Register From Guest Order Endpoint Hit..");

  // Pull contact info from the guest order they just placed
  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.userId) {
    throw new AppError("This order is already linked to an account", 400);
  }

  if (!order.customerEmail) {
    throw new AppError(
      "An email is required to create an account. Please provide one at checkout.",
      400,
    );
  }

  // Make sure no account already exists with this email
  const existingUser = await prisma.user.findUnique({
    where: {
      email: order.customerEmail,
    },
  });

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists. Please log in instead.",
      409,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    // Create the account using info already collected at guest checkout
    const newUser = await tx.user.create({
      data: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        password: hashedPassword,
        role: "CUSTOMER",
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

    // Backfill every past guest order placed with this email, not just this one
    await tx.order.updateMany({
      where: {
        userId: null,
        customerEmail: order.customerEmail,
      },
      data: {
        userId: newUser.id,
      },
    });

    // Merge any leftover guest cart items into the new user's cart
    await cartService.mergeGuestCartIntoUserCart(guestCartId, newUser.id, tx);

    return newUser;
  });

  logger.info("Account Created From Guest Order Successfully..");
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  registerFromGuestOrder,
};

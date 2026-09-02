const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

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

module.exports = {
  registerUser,
  loginUser,
};

const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const logger = require("../utils/logger");

async function registerUser({ name, email, phone, password }) {
  try {
    logger.info("Register User Endpoint Hit..");
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
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
  } catch (error) {
    logger.error("Register User Error:", error.message);
    throw error;
  }
}

async function loginUser({ email, password }) {
  try {
    logger.info("Login User Endpoint Hit..");
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    logger.info("User Logged In Successfully..");

    return user;
  } catch (error) {
    logger.error("Login User Error:", error.message);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
};

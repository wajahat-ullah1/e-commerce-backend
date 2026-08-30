const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

async function registerUser ( name, email, phone, password ) {
  try {
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


    return user;

  } catch (error) {
    console.error("Register User Error:", error.message);
    throw error;
  }
};

module.exports = {
    registerUser
}
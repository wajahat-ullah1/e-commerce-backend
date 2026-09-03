const { verifyToken } = require("../utils/jwt");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access denied. Invalid token format.", 401);
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    // Check token version
    if (decoded.tokenVersion !== user.tokenVersion) {
      throw new AppError(
        "Session expired. Please login again",
        401
      );
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;

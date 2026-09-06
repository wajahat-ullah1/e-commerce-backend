const authService = require("../services/authService");
const { generateToken } = require("../utils/jwt");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const user = await authService.registerUser({
    name,
    email,
    phone,
    password,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Verify user credentials
  const user = await authService.loginUser({
    email,
    password,
  });

  // Generate JWT token
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  await authService.resetPassword(token, password);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

const registerFromGuestOrder = asyncHandler(async (req, res) => {
  const { orderId, guestCartId, password } = req.body;

  const user = await authService.registerFromGuestOrder({
    orderId,
    guestCartId,
    password,
  });

  // Log the user in immediately - no need to ask them to log in again
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  registerFromGuestOrder,
};

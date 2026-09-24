const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().required(),

  phone: Joi.string().min(10).max(12).required(),

  password: Joi.string().min(6).required(),

  guestCartId: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),

  guestCartId: Joi.string().optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),

  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
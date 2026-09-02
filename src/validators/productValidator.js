const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().trim().min(5).required(),

  price: Joi.number().positive().required(),

  stock: Joi.number().integer().min(0).required(),

  categoryId: Joi.number().integer().positive().required(),
});

module.exports = {
  createProductSchema,
};

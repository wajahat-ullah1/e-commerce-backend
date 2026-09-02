const addressService = require("../services/addressService");
const asyncHandler = require("../utils/asyncHandler");

const createAddress = asyncHandler(async (req, res) => {
  const address = await addressService.createAddress(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
});

module.exports = {
  createAddress,
};

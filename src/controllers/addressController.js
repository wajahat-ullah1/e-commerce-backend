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

const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressService.getMyAddresses(req.user.id);

  res.status(200).json({
    success: true,
    addresses,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(
    req.user.id,
    req.params.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await addressService.deleteAddress(
    req.user.id,
    req.params.id,
  );

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
    address,
  });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await addressService.setDefaultAddress(
    req.user.id,
    req.params.id,
  );

  res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    address,
  });
});

module.exports = {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

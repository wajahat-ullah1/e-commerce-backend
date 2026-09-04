const paymentService = require("../services/paymentService");
const asyncHandler = require("../utils/asyncHandler");

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await paymentService.markOrderAsPaid(id);

  res.status(200).json({
    success: true,
    message: "Payment marked as paid successfully",
    order,
  });
});

module.exports = {
  markOrderAsPaid,
};
const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();

  res.status(200).json({
    success: true,
    stats,
  });
});

module.exports = {
  getDashboardStats,
};

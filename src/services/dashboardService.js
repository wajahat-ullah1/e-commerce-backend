const prisma = require("../config/prisma");

async function getDashboardStats() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    recentOrders,
    revenue,
  ] = await Promise.all([
    // Total customers
    prisma.user.count(),

    // Total products
    prisma.product.count(),

    // Total orders
    prisma.order.count(),

    // Pending orders
    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    // Recent 5 orders
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),

    // Calculate total revenue
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: "DELIVERED",
      },
    }),
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,

    totalRevenue: revenue._sum.totalAmount || 0,

    recentOrders,
  };
}

module.exports = {
  getDashboardStats,
};

const prisma = require("../config/prisma");
const inventoryService = require("./inventoryService");

async function getTopProducts(limit = 5) {
  const rows = await prisma.orderItem.groupBy({
    by: ["productId", "price"],
    where: { order: { status: { notIn: ["CANCELLED", "RETURNED"] } } },
    _sum: { quantity: true },
  });

  // Combine price groups into one total per product
  const totals = new Map();
  for (const row of rows) {
    const qty = row._sum.quantity || 0;
    const t = totals.get(row.productId) || {
      productId: row.productId,
      unitsSold: 0,
      revenue: 0,
    };
    t.unitsSold += qty;
    t.revenue += qty * Number(row.price);
    totals.set(row.productId, t);
  }

  const top = [...totals.values()]
    .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
    .slice(0, limit);

  if (top.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: top.map((t) => t.productId) } },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return top.flatMap((t) => {
    const p = products.find((x) => x.id === t.productId);
    if (!p) return []; // product was deleted
    return {
      id: p.id,
      name: p.name,
      image: p.images?.[0]?.url ?? null,
      category: p.category?.name ?? "-",
      stock: p.stock,
      unitsSold: t.unitsSold,
      revenue: t.revenue,
    };
  });
}

async function getDashboardStats() {
  const [
    totalCustomers,
    totalProducts,
    totalOrders,
    pendingOrders,
    recentOrders,
    lowStockProducts,
    topProducts,
    revenue,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),

    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),

    inventoryService.getLowStockProducts(),
    getTopProducts(),

    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "DELIVERED" },
    }),
  ]);

  return {
    totalCustomers,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: Number(revenue._sum.totalAmount || 0),

    lowStock: lowStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 5),

    topProducts,

    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      customer: o.customerName,
      total: Number(o.totalAmount),
      status: o.status,
      createdAt: o.createdAt,
    })),
  };
}

module.exports = { getDashboardStats };
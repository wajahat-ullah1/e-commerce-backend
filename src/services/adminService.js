const prisma = require("../config/prisma");
const logger = require("../utils/logger");

async function getAllCustomers() {
  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      createdAt: true,

      orders: {
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const now = new Date();

  return customers.map((customer) => {
    const latestOrder = customer.orders[0];

    const spent = customer.orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0,
    );

    let status = "INACTIVE";

    if (latestOrder) {
      const latestOrderDate = new Date(latestOrder.createdAt);

      const daysSinceLastOrder =
        (now - latestOrderDate) / (1000 * 60 * 60 * 24);

      if (daysSinceLastOrder <= 30) {
        status = "ACTIVE";
      }
    }

    return {
      id: customer.id,
      name: customer.name,
      profileImage: customer.profileImage,
      phone: customer.phone,
      email: customer.email,
      orders: customer.orders.length,
      spent,
      joinedAt: customer.createdAt,
      status,
    };
  });
}

module.exports = {
  getAllCustomers,
};

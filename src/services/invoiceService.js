const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function getMyInvoice(userId, invoiceId) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: Number(invoiceId),
      order: {
        userId: Number(userId),
      },
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  return invoice;
}

async function getInvoiceById(invoiceId) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: Number(invoiceId),
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  return invoice;
}

async function getAllInvoices() {
  return await prisma.invoice.findMany({
    include: {
      order: {
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });
}

module.exports = {
  getMyInvoice,
  getInvoiceById,
  getAllInvoices,
};

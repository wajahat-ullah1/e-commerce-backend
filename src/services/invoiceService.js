const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const IMAGE_ORDER = { orderBy: { position: "asc" } };

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
              product: { include: { images: IMAGE_ORDER, category: true } },
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
              product: { include: { images: IMAGE_ORDER, category: true } },
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
          customerPhone: true,
          customerEmail: true,
          shippingAddressLine1: true,
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
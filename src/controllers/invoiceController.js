const invoiceService = require("../services/invoiceService");
const asyncHandler = require("../utils/asyncHandler");
const invoicePdfService = require("../services/invoicePdfService");

const getMyInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await invoiceService.getMyInvoice(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

const getInvoiceById = asyncHandler(async (req, res, next) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

const getAllInvoices = asyncHandler(async (req, res, next) => {
  const invoices = await invoiceService.getAllInvoices();

  res.status(200).json({
    success: true,
    data: invoices,
  });
});

const downloadMyInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getMyInvoice(req.user.id, req.params.id);

  invoicePdfService.generateInvoicePdf(invoice, res);
});

const downloadAdminInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);

  invoicePdfService.generateInvoicePdf(invoice, res);
});

module.exports = {
  getMyInvoice,
  getInvoiceById,
  getAllInvoices,
  downloadAdminInvoice,
  downloadMyInvoice,
};

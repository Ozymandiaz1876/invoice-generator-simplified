import { SENDER_CONFIG, INVOICE_DEFAULTS } from "./invoice-config";
import { InvoiceType } from "@/types";
import { SimpleInvoiceType } from "./simple-schemas";

export const prepareInvoiceData = (formData: SimpleInvoiceType): InvoiceType => {
  const subTotal = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return {
    sender: {
      ...SENDER_CONFIG,
      customInputs: [],
    },
    receiver: {
      name: formData.clientName,
      address: formData.clientAddress || "",
      zipCode: "",
      city: "",
      country: "",
      email: "",
      phone: formData.clientPhone || "",
      customInputs: [],
    },
    details: {
      invoiceLogo: "",
      invoiceNumber: "",
      invoiceDate: formData.invoiceDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      dueDate: "",
      purchaseOrderNumber: "",
      currency: INVOICE_DEFAULTS.currency,
      language: INVOICE_DEFAULTS.language,
      items: formData.items.map((item) => ({
        name: item.name,
        description: item.description || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      paymentInformation: {
        bankName: "",
        accountName: "",
        accountNumber: "",
      },
      taxDetails: undefined,
      discountDetails: undefined,
      shippingDetails: undefined,
      subTotal: subTotal,
      totalAmount: subTotal,
      totalAmountInWords: "",
      additionalNotes: formData.notes || "",
      paymentTerms: "",
      signature: undefined,
      updatedAt: new Date().toISOString(),
      pdfTemplate: INVOICE_DEFAULTS.pdfTemplate,
    },
  };
};

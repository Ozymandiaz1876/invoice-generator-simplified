// Sender/Company Details - EDIT THESE VALUES
export const SENDER_CONFIG = {
  name: "Your Company Name",
  address: "123 Business Street",
  zipCode: "400001",
  city: "Mumbai",
  country: "India",
  email: "billing@company.com",
  phone: "+91 98765 43210",
};

// Invoice Settings
export const INVOICE_DEFAULTS = {
  currency: "INR",
  currencySymbol: "₹",
  pdfTemplate: 3,  // Uses InvoiceTemplateSimple (new simplified template)
  language: "English",
};

// Only Invoice Date (no number generation needed)
export const getTodayDate = () => new Date();

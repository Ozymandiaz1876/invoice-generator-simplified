// Sender/Company Details - EDIT THESE VALUES
export const SENDER_CONFIG = {
    name: "Adv Padmini M Patil",
    subheading: "Advocate at Karnataka & Delhi High Court",
    address: "House 728, HSR layout, sector 7, Bangalore, Karnataka",
    zipCode: "560068",
    city: "Bangalore",
    country: "India",
    phone: "+91 9611968641",
};

// Invoice Settings
export const INVOICE_DEFAULTS = {
    currency: "INR",
    currencySymbol: "₹",
    pdfTemplate: 3, // Uses InvoiceTemplateSimple (new simplified template)
    language: "English",
};

// Only Invoice Date (no number generation needed)
export const getTodayDate = () => new Date();

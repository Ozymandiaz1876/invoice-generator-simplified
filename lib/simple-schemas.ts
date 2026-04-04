import { z } from "zod";

export const SimpleItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Price must be positive"),
});

export const SimpleInvoiceSchema = z.object({
  // Client (SIMPLIFIED - only 3 fields)
  clientName: z.string().min(2, "Client name is required"),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  
  // Only invoice date (auto-filled)
  invoiceDate: z.date(),
  
  // Items
  items: z.array(SimpleItemSchema).min(1, "At least one item is required"),
  
  // Notes
  notes: z.string().optional(),
});

export type SimpleInvoiceType = z.infer<typeof SimpleInvoiceSchema>;
export type SimpleItemType = z.infer<typeof SimpleItemSchema>;

# Simplified Invoice Generator - Implementation Plan

## Overview
Transform the existing 5-step wizard-based invoice generator into a streamlined, single-page mobile-optimized form for Indian businesses (INR currency).

---

## Requirements Summary (UPDATED)

### Fixed/Pre-filled Values
- **Sender Details**: Company name, address, city, country, email, phone
- **Currency**: Fixed to INR (₹)
- **Template**: Fixed to Template 1
- **Invoice Date**: Today's date only
- **REMOVED**: Invoice number, Due date, Payment terms

### User Input Fields (SIMPLIFIED)
- **Client Information**: 
  - Client Name (required)
  - Address (optional) - single textarea field
  - Phone (optional)
- **Invoice Items**: Dynamic list with Name, Description (optional), Quantity, Unit Price
- **Additional Notes**: Optional text area

### Actions
- Single "Generate & Download Invoice" button
- Auto-download PDF after generation

### Features Removed
- ❌ Invoice number (removed completely)
- ❌ Due date (removed completely)
- ❌ Payment terms (removed completely)
- ❌ Client email (removed)
- ❌ Separate city/country fields (merged into single address)
- ❌ Email sending
- ❌ Save/load invoices
- ❌ Export formats (JSON, CSV, XML, etc.)
- ❌ Signature feature
- ❌ Multiple templates
- ❌ Currency selector
- ❌ Live preview panel
- ❌ Wizard/multi-step flow

---

## File Structure

### New Files to Create

```
lib/
├── invoice-config.ts              # Fixed constants (easily editable)
├── simple-schemas.ts              # Simplified Zod validation
└── invoice-adapter.ts             # Data adapter for API

app/components/invoice/
├── SimpleInvoiceMain.tsx          # Main wrapper with form context
├── SimpleInvoiceForm.tsx          # Single-page form component
└── form/
    └── sections/
        ├── ClientSection.tsx      # Client/receiver input fields (simplified)
        └── ItemsSection.tsx       # Dynamic items with calculations
```

### Files to Create/Modify

```
app/
├── [locale]/
│   └── page.tsx                   # MODIFY: Use SimpleInvoiceMain instead of InvoiceMain
├── components/
│   ├── index.ts                   # MODIFY: Export new components
│   └── templates/invoice-pdf/
│       └── InvoiceTemplateSimple.tsx  # NEW: Simplified template based on Template 1
```

---

## Implementation Phases (STEP-BY-STEP APPROACH)

### STEP 1: Configuration & Schemas (APPROVAL REQUIRED)

#### Files to Create:
1. `/lib/invoice-config.ts`
2. `/lib/simple-schemas.ts`
3. `/lib/invoice-adapter.ts`

#### 1.1 Create `/lib/invoice-config.ts`
```typescript
// Sender/Company Details - EDIT THESE VALUES
export const SENDER_CONFIG = {
  name: "Your Company Name",
  address: "123 Business Street",
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
```

#### 1.2 Create `/lib/simple-schemas.ts`
```typescript
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
```

#### 1.3 Create `/lib/invoice-adapter.ts`
```typescript
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
      city: "",
      zipCode: "",
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
```

---

### STEP 2: Create Simplified Template (APPROVAL REQUIRED)

#### File to Create: `/app/components/templates/invoice-pdf/InvoiceTemplateSimple.tsx`

**Based on:** Template 1 (`InvoiceTemplate1.tsx`)

**Changes from Template 1:**
- Remove invoice number display
- Remove due date display
- Remove payment terms display
- Keep: Sender info, Receiver info (with multi-line address support), Invoice date, Items, Total, Notes
- Support multi-line address rendering (preserve newlines from textarea)

**Why new template?**
- Preserves original Template 1 for reference
- Clean, purpose-built simplified design
- Easier to maintain and customize

---

### STEP 3: Client Section Component (APPROVAL REQUIRED)

#### File to Create: `/app/components/invoice/form/sections/ClientSection.tsx`

**Fields (SIMPLIFIED):**
1. Client Name* (required, text input)
2. Address (optional, **multi-line textarea** - supports newlines)
3. Phone (optional, tel input)

---

### STEP 4: Items Section Component (APPROVAL REQUIRED)

#### File to Create: `/app/components/invoice/form/sections/ItemsSection.tsx`

**Features:**
- Dynamic item list
- Add/remove items
- Auto-calculate line totals
- Grand total display

---

### STEP 5: Main Form Component (APPROVAL REQUIRED)

#### File to Create: `/app/components/invoice/SimpleInvoiceForm.tsx`

**Layout:**
- Sticky header
- ClientSection
- ItemsSection
- Notes textarea
- Sticky generate button (mobile)

---

### STEP 6: Main Wrapper & Integration (APPROVAL REQUIRED)

#### Files:
1. `/app/components/invoice/SimpleInvoiceMain.tsx` (new)
2. `/app/[locale]/page.tsx` (modify)
3. `/app/components/index.ts` (modify)

---

## Mobile UI Layout (SIMPLIFIED)

```
┌─────────────────────────────┐
│  Invoice Generator          │
├─────────────────────────────┤
│ BILL TO:                    │
│ Client Name* [____________] │
│ Address      [____________] │
│              [____________] │
│ Phone        [____________] │
├─────────────────────────────┤
│ ITEMS:                      │
│ ┌─────────────────────────┐ │
│ │ Item 1             [X]  │ │
│ │ [Product Name____]      │ │
│ │ [Description_____]      │ │
│ │ Qty:[1] × ₹Price:[100]  │ │
│ │ Line Total: ₹100        │ │
│ └─────────────────────────┘ │
│ [+ Add Item]                │
├─────────────────────────────┤
│ GRAND TOTAL: ₹XXX           │
├─────────────────────────────┤
│ Notes (optional):           │
│ [___________________]       │
├─────────────────────────────┤
│ [GENERATE & DOWNLOAD]       │  ← Sticky on mobile
└─────────────────────────────┘
```

**Layout:**
```
┌─────────────────────────────┐
│ Sticky Header               │
│ - Invoice Generator Title   │
├─────────────────────────────┤
│ ClientSection               │
├─────────────────────────────┤
│ ItemsSection                │
├─────────────────────────────┤
│ Notes (optional)            │
├─────────────────────────────┤
│ Sticky Generate Button      │ (mobile only)
│ [Generate & Download]       │
└─────────────────────────────┘
```

**State Management:**
- React Hook Form with Zod resolver
- Watch items array for calculations
- Form reset on successful download

**PDF Generation Flow:**
1. Validate form
2. Show loading state
3. Prepare data (merge config + form data)
4. POST to `/api/invoice/generate`
5. Auto-download blob response
6. Show success message

**Auto-save:**
- Save to localStorage on field change
- Key: `simple-invoice-draft`
- Restore on component mount





---

## Mobile Optimization Strategy

### Layout Principles
- **Single column**: All fields stack vertically
- **Full width**: Inputs take 100% width on mobile
- **Touch targets**: Minimum 44px height for buttons and inputs
- **Font size**: 16px minimum (prevents iOS zoom on focus)
- **Spacing**: Comfortable padding (p-4, gap-4)

### Sticky Elements (Mobile Only)
- **Header**: Fixed at top with "Invoice Generator" title
- **Generate Button**: Fixed at bottom, full width
- **Grand Total**: Visible near generate button

### Responsive Breakpoints
```css
/* Mobile (default) */
.form-container: single column
.sticky-header: fixed top
.sticky-button: fixed bottom

/* Tablet+ (md: 768px+) */
.form-container: max-w-2xl, centered
.sticky-button: static position
```

---

## Testing Checklist

### Functionality
- [ ] Form renders without errors
- [ ] Client name validation works (required)
- [ ] Address field accepts empty value (optional)
- [ ] Phone field accepts empty value (optional)
- [ ] Adding items works
- [ ] Removing items works
- [ ] Line totals calculate correctly (qty × price)
- [ ] Grand total updates when items change
- [ ] Invoice date shows today's date

### PDF Generation
- [ ] PDF generates without invoice number
- [ ] PDF generates without due date
- [ ] PDF generates without payment terms
- [ ] Auto-download works
- [ ] Sender info displays correctly
- [ ] Client info displays correctly

### Mobile UX
- [ ] Layout is single column on mobile (< 640px)
- [ ] Inputs are full width
- [ ] Touch targets are min 44px
- [ ] No iOS zoom on input focus
- [ ] Sticky generate button on mobile
- [ ] Form is scrollable with many items
- [ ] Readable on small screens

### Persistence
- [ ] Form data saves to localStorage
- [ ] Form data restores on reload
- [ ] localStorage uses correct key

### Dark Mode
- [ ] All components support dark mode
- [ ] Text is readable in dark mode
- [ ] Inputs have proper contrast

---

## Configuration Quick Reference

### To Change Company Details:
Edit `/lib/invoice-config.ts`:
```typescript
export const SENDER_CONFIG = {
  name: "Your Actual Company Name",  // Change this
  address: "Your Actual Address",     // Change this
  city: "Your City",                  // Change this
  // ... etc
};
```

### To Change Currency:
Edit `/lib/invoice-config.ts`:
```typescript
export const INVOICE_DEFAULTS = {
  currency: "USD",        // Change from INR
  currencySymbol: "$",    // Change from ₹
  // ...
};
```



---

## Potential Issues & Mitigations

| Issue | Risk | Mitigation |
|-------|------|------------|
| Existing localStorage conflicts | Medium | Use different key: `simple-invoice-draft` |
| Template 1 expects full schema | Low | Adapter function fills missing fields with defaults |
| Mobile keyboard covering inputs | Low | Ensure proper viewport meta tag |
| Large item lists performance | Low | Virtual scrolling if > 50 items |
| INR formatting | Low | Use toLocaleString with 'en-IN' locale |

---

## Dependencies

### Keep (Existing)
- Next.js 15
- React 18
- TypeScript
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui components
- Puppeteer (PDF generation)

### Remove (Optional Cleanup)
- react-use-wizard (not needed)
- react-signature-canvas (signatures removed)
- @dnd-kit/* (drag-drop not needed)

---

## Time Estimates

| Step | Duration |
|------|----------|
| STEP 1: Config & Schemas | 30 minutes |
| STEP 2: Template Modification | 20 minutes |
| STEP 3: Client Section | 30 minutes |
| STEP 4: Items Section | 45 minutes |
| STEP 5: Main Form | 45 minutes |
| STEP 6: Integration | 30 minutes |
| Testing & Polish | 1-2 hours |
| **Total** | **4-5 hours** |

---

## Approval Process

**Step-by-step approval workflow:**

1. ✅ **Review this updated plan** (current step)
2. ✅ **Say "approved for step X"** - I implement only that step
3. 🔄 **I implement** - Create/modify files for that step only
4. 💾 **You review & commit** - Verify changes work correctly
5. ✅ **Approve next step** - Move to next step
6. 🚀 **Continue until complete**

**Benefits of this approach:**
- Incremental changes that are easy to review
- Each step is independently testable
- Easy to rollback if needed
- Clear progress tracking

---

## Next Steps

1. **Review this plan** - Check if all requirements are covered
2. **Answer questions** (if any):
   - Should we keep the invoice date in the PDF?
   - Address field: single-line or multi-line textarea?
   - Template: modify Template 1 directly or create new?
3. **Approve Step 1** - Say "approved for step 1" to begin
4. **Implementation** - I'll implement and you verify each step

---

## Questions?

If anything is unclear or needs modification, please ask before implementation begins.

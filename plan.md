# Invoice Generator Simplification Plan

## Current State

The simplification infrastructure is partially implemented:

### ✅ Already Created:
| File | Purpose |
|------|---------|
| `lib/simple-schemas.ts` | Simplified Zod validation (client name, address, phone, items, notes) |
| `lib/invoice-config.ts` | Fixed sender/company details, currency=INR, template=3 |
| `lib/invoice-adapter.ts` | Converts simple form data to full InvoiceType for API |
| `app/components/templates/invoice-pdf/InvoiceTemplateSimple.tsx` | Clean PDF template without invoice #, due date, payment terms |

### ❌ Still Needed:
- Simple invoice form UI components (single-page, mobile-optimized)
- Integration into main page
- Removal of unused complex features

---

## Simplification Strategy

### What to REMOVE:

| Feature | Reason |
|---------|--------|
| Invoice number | Not needed for simple use case |
| Due date | Not needed for simple use case |
| Payment terms | Not needed for simple use case |
| Email sending functionality | PDF download is sufficient |
| Save/load invoice modals | Simplify workflow |
| Export formats (JSON, CSV, XML, XLSX) | PDF only |
| Signature feature | Overkill for simple invoices |
| Live preview panel | Direct download is faster |
| 5-step wizard | Replace with single-page form |
| Currency selector | Fixed to INR |
| Template selector | Fixed to Simple template |
| Client email field | Not essential |
| Sender details form | Pre-filled from config |
| Custom input fields | Not needed |
| Payment information | Not needed |
| Tax/discount/shipping fields | Not needed |

### What to SET AS DEFAULT:

| Setting | Value | Location |
|---------|-------|----------|
| Currency | INR (₹) | `lib/invoice-config.ts` |
| Currency Symbol | ₹ | `lib/invoice-config.ts` |
| PDF Template | 3 (InvoiceTemplateSimple) | `lib/invoice-config.ts` |
| Invoice Date | Today's date | Auto-generated |
| Sender Details | Pre-filled | `lib/invoice-config.ts` |
| Language | English | `lib/invoice-config.ts` |

### REQUIRED User Inputs:

1. **Client Name** (required) - text input
2. **Client Address** (optional) - multi-line textarea
3. **Client Phone** (optional) - tel input
4. **Items** (at least 1 required) - dynamic list:
   - Item Name (required)
   - Description (optional)
   - Quantity (required, default 1)
   - Unit Price (required)
5. **Notes** (optional) - textarea

### Actions:
- Single "Generate & Download Invoice" button
- Auto-download PDF after generation
- Loading state during generation

---

## Mobile-First Design

### Layout (Single Column):
```
┌─────────────────────────────┐
│  Invoice Generator          │  ← Sticky header
├─────────────────────────────┤
│ BILL TO:                    │
│ Client Name* [____________] │
│ Address      [____________] │  ← multi-line textarea
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

### Mobile UX Requirements:
- Single column layout
- Full-width inputs on mobile
- Touch targets minimum 44px
- Font size 16px minimum (prevents iOS zoom)
- Sticky generate button at bottom on mobile
- Sticky header with title

---

## Implementation Steps

### Step 1: Create Simple Invoice Context
**Files:**
- `contexts/SimpleInvoiceContext.tsx`

**Purpose:**
- Manage simple form state with React Hook Form
- Handle PDF generation via API
- Auto-download generated PDF
- Auto-save to localStorage (`simple-invoice-draft`)

### Step 2: Create Client Section Component
**Files:**
- `app/components/invoice/form/sections/ClientSection.tsx`

**Fields:**
- Client Name* (FormInput, required)
- Address (FormTextarea, optional, multi-line)
- Phone (FormInput, optional, type=tel)

### Step 3: Create Items Section Component
**Files:**
- `app/components/invoice/form/sections/ItemsSection.tsx`

**Features:**
- Dynamic item list with useFieldArray
- Add/remove items
- Auto-calculate line totals
- Grand total display
- Responsive item cards

### Step 4: Create Simple Invoice Form
**Files:**
- `app/components/invoice/SimpleInvoiceForm.tsx`

**Layout:**
- Sticky header with "Invoice Generator" title
- ClientSection
- ItemsSection with grand total
- Notes textarea
- Sticky generate button (mobile only)

### Step 5: Create Simple Invoice Main
**Files:**
- `app/components/invoice/SimpleInvoiceMain.tsx`

**Purpose:**
- Wrap form with SimpleInvoiceContextProvider
- Set up React Hook Form with Zod resolver
- Use simple-schemas for validation

### Step 6: Update Index Exports
**Files:**
- `app/components/index.ts`

**Actions:**
- Export new components
- Remove obsolete exports (optional cleanup)

### Step 7: Update Main Page
**Files:**
- `app/[locale]/page.tsx`

**Actions:**
- Replace InvoiceMain with SimpleInvoiceMain

### Step 8: Cleanup (Optional)
- Remove unused components (wizard, signature, modals)
- Remove unused dependencies (react-use-wizard, react-signature-canvas, @dnd-kit/*)
- Clean up unused API routes if needed

---

## Configuration Reference

### To Change Company Details:
Edit `lib/invoice-config.ts`:
```typescript
export const SENDER_CONFIG = {
  name: "Your Actual Company Name",
  address: "Your Actual Address",
  city: "Your City",
  country: "Your Country",
  email: "your@email.com",
  phone: "Your Phone",
};
```

### To Change Currency:
Edit `lib/invoice-config.ts`:
```typescript
export const INVOICE_DEFAULTS = {
  currency: "USD",
  currencySymbol: "$",
  pdfTemplate: 3,
  language: "English",
};
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
- [ ] Multi-line address renders with line breaks

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
- [ ] localStorage uses correct key: `simple-invoice-draft`

### Dark Mode
- [ ] All components support dark mode
- [ ] Text is readable in dark mode
- [ ] Inputs have proper contrast

---

## Dependencies

### Keep:
- Next.js 15
- React 18
- TypeScript
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui components
- Puppeteer (PDF generation)
- lucide-react (icons)

### Remove (Optional Cleanup):
- react-use-wizard
- react-signature-canvas
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

---

## Time Estimate

| Step | Duration |
|------|----------|
| Step 1: Simple Invoice Context | 30 min |
| Step 2: Client Section | 20 min |
| Step 3: Items Section | 30 min |
| Step 4: Simple Invoice Form | 30 min |
| Step 5: Simple Invoice Main | 20 min |
| Step 6: Update Exports | 10 min |
| Step 7: Update Page | 10 min |
| Step 8: Testing & Polish | 1-2 hours |
| **Total** | **3-4 hours** |

---

## Next Actions

1. ✅ Review this plan
2. ✅ Approve and proceed with implementation
3. 🔄 Implement step by step
4. 💾 Test each step
5. 🚀 Deploy

---

## Notes

- The existing complex code is preserved and can be restored if needed
- The feature flag `IS_SIMPLIFIED` in `lib/variables.ts` can be used to toggle between modes if needed
- The API endpoint `/api/invoice/generate` will work with the adapted data
- Template ID 3 should be mapped to InvoiceTemplateSimple in DynamicInvoiceTemplate

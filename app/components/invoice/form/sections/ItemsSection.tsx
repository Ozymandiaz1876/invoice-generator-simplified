"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

// Components
import { FormInput, FormTextarea, BaseButton, Subheading } from "@/app/components";

// Icons
import { Plus, Trash2 } from "lucide-react";

// Types
import { SimpleInvoiceType } from "@/lib/simple-schemas";

// Variables
import { INVOICE_DEFAULTS } from "@/lib/invoice-config";

const ItemsSection = () => {
  const { control } = useFormContext<SimpleInvoiceType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items for total calculation
  const items = useWatch({
    control,
    name: "items",
  });

  // Calculate grand total
  const grandTotal = items?.reduce((sum, item) => {
    const quantity = Number(item?.quantity) || 0;
    const unitPrice = Number(item?.unitPrice) || 0;
    return sum + quantity * unitPrice;
  }, 0) || 0;

  const addNewItem = () => {
    append({
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <Subheading>Items:</Subheading>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative border border-border rounded-lg p-4 space-y-3 bg-card"
          >
            {/* Remove button */}
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Item name */}
            <FormInput
              name={`items.${index}.name`}
              label={`Item ${index + 1}`}
              placeholder="Product/service name"
              required
            />

            {/* Description */}
            <FormTextarea
              name={`items.${index}.description`}
              label="Description"
              placeholder="Description (optional)"
              rows={2}
            />

            {/* Quantity and Price row */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                name={`items.${index}.quantity`}
                label="Qty"
                type="number"
                inputMode="numeric"
                min={1}
                required
              />

              <FormInput
                name={`items.${index}.unitPrice`}
                label={`Price (${INVOICE_DEFAULTS.currencySymbol})`}
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                required
              />
            </div>

            {/* Line total */}
            <div className="text-right text-sm">
              <span className="text-muted-foreground">Line Total: </span>
              <span className="font-medium">
                {INVOICE_DEFAULTS.currencySymbol}
                {(
                  (Number(items?.[index]?.quantity) || 0) *
                  (Number(items?.[index]?.unitPrice) || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add item button */}
      <BaseButton
        type="button"
        variant="outline"
        size="sm"
        onClick={addNewItem}
        className="w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </BaseButton>

      {/* Grand Total */}
      <div className="border-t border-border pt-4 mt-2">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Grand Total:</span>
          <span>
            {INVOICE_DEFAULTS.currencySymbol}
            {grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ItemsSection;

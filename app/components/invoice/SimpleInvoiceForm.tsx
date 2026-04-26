"use client";

import { useFormContext } from "react-hook-form";

// ShadCn
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Components
import { ClientSection, ItemsSection } from "@/app/components";
import { BaseButton } from "@/app/components";

// Context
import { useSimpleInvoiceContext } from "@/contexts/SimpleInvoiceContext";

// Types
import { SimpleInvoiceType } from "@/lib/simple-schemas";

// Icons
import { FileInput, Loader2 } from "lucide-react";

const SimpleInvoiceForm = () => {
  const { handleSubmit, control } = useFormContext<SimpleInvoiceType>();
  const { onFormSubmit, invoicePdfLoading } = useSimpleInvoiceContext();

  return (
    <Form {...useFormContext()}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col min-h-screen"
      >
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-4 px-4">
          <h1 className="text-xl font-bold text-center">Invoice Generator</h1>
        </header>

        {/* Main Form Content */}
        <main className="flex-1 px-4 py-6 space-y-8 max-w-2xl mx-auto w-full">
          {/* Client Section */}
          <ClientSection />

          {/* Items Section */}
          <ItemsSection />

          {/* Notes */}
          <section className="flex flex-col gap-4">
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes..."
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </main>

        {/* Sticky Generate Button (Mobile) / Static Footer (Desktop) */}
        <footer className="sticky bottom-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border p-4 safe-area-pb">
          <div className="max-w-2xl mx-auto">
            <BaseButton
              type="submit"
              className="w-full h-12 text-base font-semibold"
              loading={invoicePdfLoading}
              loadingText="Generating..."
            >
              {invoicePdfLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileInput className="w-5 h-5 mr-2" />
                  Generate Invoice
                </>
              )}
            </BaseButton>
          </div>
        </footer>
      </form>
    </Form>
  );
};

export default SimpleInvoiceForm;

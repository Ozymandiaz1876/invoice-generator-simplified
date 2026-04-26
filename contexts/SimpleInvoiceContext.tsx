"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useFormContext } from "react-hook-form";

// Services
import { prepareInvoiceData } from "@/lib/invoice-adapter";

// Variables
import { GENERATE_PDF_API } from "@/lib/variables";

// Types
import { SimpleInvoiceType } from "@/lib/simple-schemas";

const LOCAL_STORAGE_KEY = "simple-invoice-draft";

interface SimpleInvoiceContextType {
  invoicePdfLoading: boolean;
  onFormSubmit: (values: SimpleInvoiceType) => Promise<void>;
  resetForm: () => void;
}

const defaultContext: SimpleInvoiceContextType = {
  invoicePdfLoading: false,
  onFormSubmit: async () => {},
  resetForm: () => {},
};

export const SimpleInvoiceContext = createContext(defaultContext);

export const useSimpleInvoiceContext = () => {
  return useContext(SimpleInvoiceContext);
};

type SimpleInvoiceContextProviderProps = {
  children: React.ReactNode;
};

export const SimpleInvoiceContextProvider = ({
  children,
}: SimpleInvoiceContextProviderProps) => {
  const [invoicePdfLoading, setInvoicePdfLoading] = useState<boolean>(false);

  // Get form values and methods from form context
  const { getValues, reset, watch } = useFormContext<SimpleInvoiceType>();

  // Persist form state to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const subscription = watch((value) => {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
      } catch {
        // Ignore storage errors
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  /**
   * Generate and auto-download PDF
   */
  const generateAndDownloadPdf = useCallback(
    async (data: SimpleInvoiceType) => {
      setInvoicePdfLoading(true);

      try {
        // Prepare full invoice data from simple form data
        const invoiceData = prepareInvoiceData(data);

        const response = await fetch(GENERATE_PDF_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
          throw new Error("Failed to generate PDF");
        }

        // PDF response - auto-download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        console.error("PDF generation error:", err);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setInvoicePdfLoading(false);
      }
    },
    []
  );

  /**
   * Handles form submission
   */
  const onFormSubmit = useCallback(
    async (data: SimpleInvoiceType) => {
      await generateAndDownloadPdf(data);
    },
    [generateAndDownloadPdf]
  );

  /**
   * Reset form to default values
   */
  const resetForm = useCallback(() => {
    reset({
      clientName: "",
      clientAddress: "",
      clientPhone: "",
      invoiceDate: new Date(),
      items: [{ name: "", description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    });

    // Clear localStorage
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  }, [reset]);

  const value = useMemo(
    () => ({
      invoicePdfLoading,
      onFormSubmit,
      resetForm,
    }),
    [invoicePdfLoading, onFormSubmit, resetForm]
  );

  return (
    <SimpleInvoiceContext.Provider value={value}>
      {children}
    </SimpleInvoiceContext.Provider>
  );
};

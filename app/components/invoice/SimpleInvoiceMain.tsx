"use client";

import { useEffect, useMemo } from "react";

// RHF
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod
import { z } from "zod";

// Context
import { SimpleInvoiceContextProvider } from "@/contexts/SimpleInvoiceContext";

// Components
import { SimpleInvoiceForm } from "@/app/components";

// Schemas
import { SimpleInvoiceSchema, SimpleInvoiceType } from "@/lib/simple-schemas";

const LOCAL_STORAGE_KEY = "simple-invoice-draft";

const SimpleInvoiceMain = () => {
  // Load saved draft from localStorage
  const savedDraft = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date string back to Date object
        if (parsed.invoiceDate) {
          parsed.invoiceDate = new Date(parsed.invoiceDate);
        }
        return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }, []);

  // Default values
  const defaultValues: SimpleInvoiceType = {
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    invoiceDate: new Date(),
    items: [{ name: "", description: "", quantity: 1, unitPrice: 0 }],
    notes: "",
  };

  // Initialize form
  const form = useForm<SimpleInvoiceType>({
    resolver: zodResolver(SimpleInvoiceSchema),
    defaultValues: savedDraft || defaultValues,
    mode: "onChange",
  });

  return (
    <FormProvider {...form}>
      <SimpleInvoiceContextProvider>
        <SimpleInvoiceForm />
      </SimpleInvoiceContextProvider>
    </FormProvider>
  );
};

export default SimpleInvoiceMain;

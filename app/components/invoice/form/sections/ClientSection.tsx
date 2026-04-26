"use client";

// Components
import { FormInput, FormTextarea, Subheading } from "@/app/components";

const ClientSection = () => {
  return (
    <section className="flex flex-col gap-4">
      <Subheading>Bill To:</Subheading>

      <FormInput
        name="clientName"
        label="Client Name"
        placeholder="Enter client name"
        required
      />

      <FormTextarea
        name="clientAddress"
        label="Address"
        placeholder="Enter client address (optional)"
        rows={3}
      />

      <FormInput
        name="clientPhone"
        label="Phone"
        placeholder="Enter client phone (optional)"
        type="tel"
        inputMode="tel"
        pattern="[0-9+\\-\\(\\)\\s]*"
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/[^\d+\-\(\)\s]/g, "");
        }}
      />
    </section>
  );
};

export default ClientSection;

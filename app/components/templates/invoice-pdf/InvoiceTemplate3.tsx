import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplateSimple = (data: InvoiceType) => {
    const { sender, receiver, details } = data;

    return (
        <InvoiceLayout data={data}>
            <div className="flex justify-between">
                <div>
                    {details.invoiceLogo && (
                        <img
                            src={details.invoiceLogo}
                            width={140}
                            height={100}
                            alt={`Logo of ${sender.name}`}
                        />
                    )}
                    <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600">
                        {sender.name}
                    </h1>
                </div>
                <div className="text-right">
                    <address className="not-italic text-gray-800">
                        {sender.address}
                        <br />
                        {sender.city}
                        <br />
                        {sender.country}
                        <br />
                    </address>
                </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Bill to:
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {receiver.name}
                    </h3>
                    {receiver.address && (
                        <p className="mt-2 text-gray-500 whitespace-pre-line">
                            {receiver.address}
                        </p>
                    )}
                    {receiver.phone && (
                        <p className="mt-1 text-gray-500">{receiver.phone}</p>
                    )}
                </div>
                <div className="sm:text-right">
                    <dl className="grid sm:grid-cols-6 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800">
                            Invoice date:
                        </dt>
                        <dd className="col-span-3 text-gray-500">
                            {new Date(details.invoiceDate).toLocaleDateString(
                                "en-US",
                                DATE_OPTIONS,
                            )}
                        </dd>
                    </dl>
                </div>
            </div>

            <div className="mt-3">
                <div className="border border-gray-200 p-1 rounded-lg space-y-1">
                    <div className="hidden sm:grid sm:grid-cols-5">
                        <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
                            Item
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            Qty
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            Rate
                        </div>
                        <div className="text-right text-xs font-medium text-gray-500 uppercase">
                            Amount
                        </div>
                    </div>
                    <div className="hidden sm:block border-b border-gray-200"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-1">
                        {details.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="col-span-full sm:col-span-2 border-b border-gray-300">
                                    <p className="font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-600 whitespace-pre-line">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">
                                        {item.quantity}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">
                                        {item.unitPrice} {details.currency}
                                    </p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="sm:text-right text-gray-800">
                                        {item.total} {details.currency}
                                    </p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="sm:hidden border-b border-gray-200"></div>
                </div>
            </div>

            <div className="mt-2 flex sm:justify-end">
                <div className="sm:text-right space-y-2">
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800">
                            Subtotal:
                        </dt>
                        <dd className="col-span-2 text-gray-500">
                            {formatNumberWithCommas(Number(details.subTotal))}{" "}
                            {details.currency}
                        </dd>
                    </dl>
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800">
                            Total:
                        </dt>
                        <dd className="col-span-2 text-gray-500">
                            {formatNumberWithCommas(
                                Number(details.totalAmount),
                            )}{" "}
                            {details.currency}
                        </dd>
                    </dl>
                </div>
            </div>

            {details.additionalNotes && (
                <div className="mt-4">
                    <p className="font-semibold text-blue-600">
                        Additional notes:
                    </p>
                    <p className="font-regular text-gray-800 whitespace-pre-line">
                        {details.additionalNotes}
                    </p>
                </div>
            )}

            <div className="mt-6">
                <p className="text-gray-500 text-sm">
                    If you have any questions concerning this invoice, use the
                    following contact information:
                </p>
                <div className="mt-2">
                    <p className="block text-sm font-medium text-gray-800">
                        {sender.email}
                    </p>
                    <p className="block text-sm font-medium text-gray-800">
                        {sender.phone}
                    </p>
                </div>
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplateSimple;

// ShadCn
import { Toaster } from "@/components/ui/toaster";
// Contexts
import Providers from "@/contexts/Providers";
// Fonts
import {
    outfit,
} from "@/lib/fonts";
// SEO
import { ROOTKEYWORDS } from "@/lib/seo";
// Variables
import { BASE_URL, LOCALES } from "@/lib/variables";
// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";
import type { Metadata } from "next";
// Next Intl
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Invoice Generator",
    description: "Simple invoice generator",
    icons: [{ rel: "icon", url: Favicon.src }],
    keywords: ["invoice", "invoice generator"],
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export function generateStaticParams() {
    // Next.js expects an array of objects: [{ locale: 'en' },
    // ...]
    const locales = LOCALES.map((locale) => ({ locale: locale.code }));
    return locales;
}

export default async function LocaleLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;

    const { locale } = params;

    const { children } = props;

    let messages;
    try {
        messages = (await import(`@/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <head suppressHydrationWarning>
            </head>
            <body
                className={`${outfit.className} antialiased bg-background`}
                suppressHydrationWarning
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>
                        {children}

                        {/* Toast component */}
                        <Toaster />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

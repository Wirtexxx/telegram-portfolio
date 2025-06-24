import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Nav from "@/components/NavBar/NavBar";
// import Footer from "@/components/Footer/Footer";
import { Root } from "@/components/Root/Root";

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode | React.ReactNode[];
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body className="min-h-screen flex flex-col p-0">
                <NextIntlClientProvider locale={locale}>
                    <Root>{children}</Root>
                    <Nav />
                    {/* Uncomment the line below to enable the footer */}
                    {/* <Footer /> */}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

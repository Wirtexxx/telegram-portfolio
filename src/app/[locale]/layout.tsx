import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import BottomNav from "@/components/NavBar/BottomNavBar";
import TopNav from "@/components/NavBar/TopNavBarWrapper";
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
            <body className="min-h-screen flex flex-col p-0 bg-gray-950">
                <NextIntlClientProvider locale={locale}>
                    <TopNav locale={locale} />
                    <Root>{children}</Root>
                    <BottomNav />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

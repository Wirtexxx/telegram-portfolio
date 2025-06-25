"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import TopNav from "./TopNavBar";
export default function TopNavBarWrapper({ locale }: { locale: string }) {
    return (
        <TonConnectUIProvider
            manifestUrl={`${process.env.NEXT_PUBLIC_URL}/tonconnect-manifest.json`}
        >
            <TopNav locale={locale} />
        </TonConnectUIProvider>
    );
}

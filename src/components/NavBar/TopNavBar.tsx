"use client";

import LanguageSwitcher from "@/components/LocalSwitcher/LanguageSwitcher";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { bem } from "@/css/bem";
import { List } from "@telegram-apps/telegram-ui";
const [, e] = bem("ton-connect-page");

const TopNav = ({ locale }: { locale: string }) => {
    const wallet = useTonWallet();

    if (!wallet) {
        return (
            <nav className="p-4 pt-8 justify-between flex items-center">
                <LanguageSwitcher locale={locale} />
                <TonConnectButton className={e("button")} />
            </nav>
        );
    }
    return (
        <List>
            {"imageUrl" in wallet && (
                <TonConnectButton className={e("button-connected")} />
            )}
        </List>
    );
};

export default TopNav;

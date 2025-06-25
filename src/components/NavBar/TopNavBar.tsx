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
            <nav className="fixed w-full p-4 pt-8 justify-between flex items-center">
                <LanguageSwitcher locale={locale} />
                <TonConnectButton className={e("button")} />
            </nav>
        );
    }
    return (
        <nav className="fixedp-4 pt-8 justify-between flex items-center">
            <LanguageSwitcher locale={locale} />
            <List>
                {"imageUrl" in wallet && (
                    <TonConnectButton className={e("button-connected")} />
                )}
            </List>
        </nav>
    );
};

export default TopNav;

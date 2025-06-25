"use client";

import LanguageSwitcher from "@/components/LocalSwitcher/LanguageSwitcher";
import { FiUser, FiLogIn } from "react-icons/fi";
import { useState } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { bem } from "@/css/bem";
import {
    Avatar,
    Cell,
    List,
    Navigation,
    Placeholder,
    Text,
    Title,
} from "@telegram-apps/telegram-ui";
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
    const {
        account: { chain, publicKey, address },
        device: { appName, appVersion, maxProtocolVersion, platform, features },
    } = wallet;
    return (
        <List>
            {"imageUrl" in wallet && (
                <TonConnectButton className={e("button-connected")} />
            )}
        </List>
    );
};

export default TopNav;

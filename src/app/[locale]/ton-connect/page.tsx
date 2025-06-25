"use client";

import { openLink } from "@telegram-apps/sdk-react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import {
    Avatar,
    Cell,
    List,
    Navigation,
    Placeholder,
    Section,
    Text,
    Title,
} from "@telegram-apps/telegram-ui";

import { Page } from "@/components/Page";
import { bem } from "@/css/bem";

import "./TONConnectPage.css";

const [, e] = bem("ton-connect-page");

export default function TONConnectPage() {
    const wallet = useTonWallet();

    if (!wallet) {
        return (
            <Page>
                <Placeholder
                    className={e("placeholder")}
                    header="TON Connect"
                    description={
                        <>
                            <Text>
                                To display the data related to the TON Connect,
                                it is required to connect your wallet
                            </Text>
                            <TonConnectButton className={e("button")} />
                        </>
                    }
                />
            </Page>
        );
    }

    return (
        <Page>
            <List>
                {"imageUrl" in wallet && (
                    <>
                        <Section>
                            <Cell
                                before={
                                    <Avatar
                                        src={wallet.imageUrl}
                                        alt="Provider logo"
                                        width={60}
                                        height={60}
                                    />
                                }
                                after={<Navigation>About wallet</Navigation>}
                                subtitle={wallet.appName}
                                onClick={(e) => {
                                    e.preventDefault();
                                    openLink(wallet.aboutUrl);
                                }}
                            >
                                <Title level="3">{wallet.name}</Title>
                            </Cell>
                        </Section>
                        <TonConnectButton className={e("button-connected")} />
                    </>
                )}
            </List>
        </Page>
    );
}

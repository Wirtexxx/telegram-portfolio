"use client";

import { type PropsWithChildren } from "react";
import { miniApp, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";
import { useDidMount } from "@/hooks/useDidMount";

import "./styles.css";

function RootInner({ children }: PropsWithChildren) {
    const lp = useLaunchParams();

    const isDark = useSignal(miniApp.isDark);
    // const initDataUser = useSignal(initData.user);

    // Set the user locale.
    // useEffect(() => {
    //     initDataUser && setLocale(initDataUser.language_code);
    // }, [initDataUser]);

    return (
        <TonConnectUIProvider
            manifestUrl={`${process.env.NEXT_PUBLIC_URL}/tonconnect-manifest.json`}
        >
            <AppRoot
                appearance={isDark ? "dark" : "light"}
                platform={
                    ["macos", "ios"].includes(lp.tgWebAppPlatform)
                        ? "ios"
                        : "base"
                }
                className="pb-28 pt-24"
            >
                {children}
            </AppRoot>
        </TonConnectUIProvider>
    );
}

export function Root(props: PropsWithChildren) {
    // Unfortunately, Telegram Mini Apps does not allow us to use all features of
    // the Server Side Rendering. That's why we are showing loader on the server
    // side.
    const didMount = useDidMount();

    return didMount ? (
        <ErrorBoundary fallback={ErrorPage}>
            <RootInner {...props} />
        </ErrorBoundary>
    ) : null;
}

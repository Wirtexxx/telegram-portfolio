"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaStar } from "react-icons/fa";
import {
    TonConnectButton,
    useTonConnectUI,
    useTonWallet,
    useTonAddress,
    SendTransactionRequest,
} from "@tonconnect/ui-react";
import Image from "next/image";
import { Page } from "@/components/Page";
import {
    initDataState as _initDataState,
    useSignal,
    type User as TgUser,
} from "@telegram-apps/sdk-react";
import { openInvoice } from "@telegram-apps/sdk-react";

const tonPresets = [1, 2.5, 5, 10];

export default function TipPage() {
    const t = useTranslations("Tip");
    const [tab, setTab] = useState<"stars" | "ton">("stars");
    const [stars, setStars] = useState<number>(10);
    const [amount, setTon] = useState<number | "">(1);
    const wallet = useTonWallet();
    const tonAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();
    const initDataState = useSignal(_initDataState);
    const telegramUser = initDataState?.user as TgUser | null;
    const [userId, setUserId] = useState<number | null>(null);

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingStars, setLoadingStars] = useState(false);

    useEffect(() => {
        if (!telegramUser) {
            setError(t("telegramUserNotFound"));
            return;
        }
        setUserId(telegramUser.id);
    }, [telegramUser, t]);

    // ==== TG STARS ====
    const sendStarsTip = async () => {
        setError(null);
        setSuccess(null);
        setLoadingStars(true);
        try {
            const res = await fetch("/api/tips/stars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    amount: stars,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.invoiceLink) {
                throw new Error(data.error || t("paymentError"));
            }

            openInvoice(data.invoiceLink, "url").then((status: string) => {
                if (status === "paid") {
                    setSuccess(t("starsSent"));
                } else if (status === "cancelled") {
                    setError(t("paymentCanceled"));
                } else {
                    setError("Платёж: " + status);
                }
                setLoadingStars(false);
            });
        } catch {
            setError(t("paymentError"));
            setLoadingStars(false);
        }
    };

    // ==== TON ====
    const handleTonClick = (amount: number) => setTon(amount);
    const handleCustomTon = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.replace(",", ".");
        if (v === "") setTon("");
        else if (/^\d*\.?\d*$/.test(v)) setTon(Number(v));
    };

    const handleSendTon = async () => {
        setError(null);
        setSuccess(null);

        if (!wallet || !tonAddress) {
            setError(t("connectTon"));
            return;
        }
        if (!amount || amount < 0.1) {
            setError(t("minTon"));
            return;
        }

        try {
            const nano = (amount * 1e9).toFixed(0);
            const txReq: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address:
                            process.env.NEXT_PUBLIC_TON_SERVICE_WALLET_ADDRESS!,
                        amount: nano,
                        payload: "",
                    },
                ],
            };

            const { boc } = await tonConnectUI.sendTransaction(txReq);
            if (!boc) throw new Error("Подпись TON не получена");

            const { Cell } = await import("ton-core");
            const bocBytes = Uint8Array.from(atob(boc), (c) => c.charCodeAt(0));
            const [cell] = Cell.fromBoc(Buffer.from(bocBytes));
            const tx_hash = cell.hash().toString("base64");

            const resp = await fetch("/api/tips/ton", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: tonAddress,
                    tx_hash,
                    ton: amount,
                }),
            });

            if (!resp.ok) {
                const data = await resp.json();
                throw new Error(data.error || "Ошибка сервера");
            }

            setSuccess(t("tonSent"));
        } catch {
            setError("Ошибка отправки TON");
        }
    };

    return (
        <Page>
            <div className="flex flex-col items-center justify-center bg-gray-950 px-4 py-8">
                <div className="bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8">
                    <h1 className="text-3xl font-bold text-center text-purple-300 mb-2">
                        {t("tipTitle")}
                    </h1>
                    <p className="text-center text-gray-400 mb-6">
                        {t("tipSubtitle")}
                    </p>

                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            className={`px-4 py-2 rounded-t-lg font-semibold transition-all
                            ${
                                tab === "stars"
                                    ? "bg-gray-950 text-yellow-400 border-b-2 border-yellow-400"
                                    : "bg-transparent text-gray-400 hover:text-yellow-300"
                            }`}
                            onClick={() => setTab("stars")}
                        >
                            {t("stars")}
                        </button>
                        <button
                            className={`px-4 py-2 rounded-t-lg font-semibold transition-all
                            ${
                                tab === "ton"
                                    ? "bg-gray-950 text-cyan-400 border-b-2 border-cyan-400"
                                    : "bg-transparent text-gray-400 hover:text-cyan-300"
                            }`}
                            onClick={() => setTab("ton")}
                        >
                            TON
                        </button>
                    </div>

                    {/* Tab Content */}
                    {tab === "stars" && (
                        <div className="animate-fade-in">
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-200 font-medium">
                                        {t("stars")}
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                        <FaStar className="inline" /> {stars}
                                    </span>
                                </div>
                                <div className="mb-4 flex items-center">
                                    <span className="text-xs text-gray-400 mr-2">
                                        {t("starsMin")}
                                    </span>
                                    <input
                                        type="range"
                                        min={1}
                                        max={500}
                                        value={stars}
                                        onChange={(e) =>
                                            setStars(Number(e.target.value))
                                        }
                                        className="w-full accent-yellow-400"
                                    />
                                    <span className="text-xs text-gray-400 ml-2">
                                        {t("starsMax")}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1</span>
                                    <span>500</span>
                                </div>
                            </div>
                            <button
                                onClick={sendStarsTip}
                                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.02] active:scale-100 transition-transform"
                                disabled={loadingStars}
                            >
                                {loadingStars
                                    ? t("paymentWait")
                                    : t("starsSend")}
                            </button>
                        </div>
                    )}

                    {tab === "ton" && (
                        <div className="animate-fade-in">
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-200 font-medium">
                                        {t("ton")}
                                    </span>
                                    <span className="text-cyan-400 font-bold text-lg">
                                        {amount ? amount : 0} TON
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tonPresets.map((val) => (
                                        <button
                                            key={val}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors font-medium ${
                                                amount === val
                                                    ? "bg-cyan-600 text-white border-cyan-500"
                                                    : "bg-gray-800 text-cyan-300 border-gray-700 hover:bg-cyan-700 hover:text-white"
                                            }`}
                                            onClick={() => handleTonClick(val)}
                                        >
                                            <span>{val}</span>
                                            <Image
                                                src={"/ton.svg"}
                                                width={16}
                                                height={16}
                                                alt="ton logo"
                                            />
                                        </button>
                                    ))}
                                    {/* Своя сумма */}
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Своя сумма"
                                        value={
                                            typeof amount === "number" &&
                                            !tonPresets.includes(amount)
                                                ? amount
                                                : ""
                                        }
                                        onChange={handleCustomTon}
                                        className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-cyan-300 w-full focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <TonConnectButton className="w-full" />
                                <button
                                    onClick={handleSendTon}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-700 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.02] active:scale-100 transition-transform"
                                >
                                    {t("tonSend")}
                                </button>
                                {!wallet && (
                                    <span className="text-xs text-gray-500">
                                        {t("connectTon")}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Общие сообщения об успехе/ошибке */}
                    {(success || error) && (
                        <div
                            className={`mt-5 w-full px-4 py-2 rounded-lg text-center text-sm font-medium ${
                                success
                                    ? "bg-green-900 text-green-300"
                                    : "bg-red-900 text-red-300"
                            }`}
                        >
                            {success || error}
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
}

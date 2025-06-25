import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const PROVIDER_TOKEN = process.env.TELEGRAM_STARS_PROVIDER_TOKEN!;

type CreateInvoiceLinkResponse = {
    ok: boolean;
    result?: { url: string };
    description?: string;
};

export async function POST(req: NextRequest) {
    try {
        const { user_id, amount } = await req.json();

        if (!user_id || !amount || amount < 1) {
            return NextResponse.json(
                { error: "user_id and amount (>=1) required" },
                { status: 400 }
            );
        }

        const invoiceRes = await createStarsInvoice(user_id, amount);

        if (!invoiceRes.ok || !invoiceRes.result) {
            return NextResponse.json(
                {
                    error:
                        "Telegram API error: " +
                        (invoiceRes.description || "Unknown"),
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ invoiceLink: invoiceRes.result.url });
    } catch {
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}

async function createStarsInvoice(
    user_id: number,
    amount: number
): Promise<CreateInvoiceLinkResponse> {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`;
    const payload = {
        title: "Поддержка проекта",
        description: "Чаевые звёздами Telegram",
        payload: `support_stars_user_${user_id}_${Date.now()}`,
        provider_token: PROVIDER_TOKEN,
        currency: "XTR",
        prices: [{ label: "Звёзды", amount }], // amount — целое число
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return await res.json();
}

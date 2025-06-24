"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";
import { FaBoxes, FaUser, FaHeart } from "react-icons/fa";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { useTranslations } from "next-intl";

export default function BottomNav() {
    const pathname = usePathname();
    const t = useTranslations("BottomNav");

    const triggerHaptic = useCallback(() => {
        if (
            hapticFeedback.isSupported() &&
            hapticFeedback.impactOccurred.isAvailable()
        ) {
            hapticFeedback.impactOccurred("light");
        } else if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }, []);

    const links = [
        { href: "/about", label: t("about"), icon: <FaUser /> },
        { href: "/gallery", label: t("gallery"), icon: <FaBoxes /> },
        { href: "/tip", label: t("tip"), icon: <FaHeart /> },
    ];

    return (
        <div className="fixed bottom-4 z-40 w-full flex justify-center pointer-events-none">
            <nav className="pointer-events-auto relative mb-4 w-[calc(100%-2rem)] max-w-md">
                <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl shadow-black/50" />
                <div className="absolute -top-1 left-1/4 w-16 h-16 bg-gray-800/20 rounded-full filter blur-xl -z-10" />
                <div className="absolute -top-1 right-1/4 w-16 h-16 bg-gray-800/20 rounded-full filter blur-xl -z-10" />

                <ul className="relative flex justify-between px-4 py-2">
                    {links.map(({ href, label, icon }) => {
                        const isActive = pathname.startsWith(href);
                        return (
                            <li key={href} className="flex-1">
                                <Link
                                    href={href}
                                    onClick={triggerHaptic}
                                    className={`group flex flex-col items-center justify-center p-2 mx-1 rounded-xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-gradient-to-b from-gray-700 to-gray-900 text-white shadow-lg shadow-gray-500/20"
                                            : "text-gray-400 hover:text-gray-200"
                                    }`}
                                >
                                    <div
                                        className={`p-2 rounded-full transition-all ${
                                            isActive
                                                ? "bg-gray-600"
                                                : "bg-transparent group-hover:bg-gray-700"
                                        }`}
                                    >
                                        {React.cloneElement(icon, {
                                            size: 20,
                                            className: `${
                                                icon.props.className
                                            } ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-gray-400 group-hover:text-gray-200"
                                            }`,
                                        })}
                                    </div>
                                    <span
                                        className={`text-xs font-medium mt-1 ${
                                            isActive
                                                ? "text-white"
                                                : "text-gray-500 group-hover:text-gray-300"
                                        }`}
                                    >
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

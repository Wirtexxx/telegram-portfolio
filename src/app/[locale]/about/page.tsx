"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FaTelegram, FaGlobe, FaGithub, FaHeart } from "react-icons/fa";
import Link from "next/link";
import type { InfoData } from "@/types";
import TryAgain from "@/components/TryAgain/TryAgain";

export default function AboutPage() {
    const t = useTranslations("About");
    const locale = useLocale();

    const [info, setInfo] = useState<InfoData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const profileCardRef = useRef<HTMLDivElement>(null);
    const philosophyRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/info");
                if (!response.ok) {
                    throw new Error("Failed to fetch info data");
                }
                const data = await response.json();
                setInfo(data);
            } catch (err) {
                setError("An error occurred while loading information");
            }
        };

        fetchData();
    }, []);
    const getLocalizedData = (item: InfoData) => ({
        ...item,
        description: item.description[locale] || item.description.en || "",
    });

    if (error || !info) {
        return <TryAgain error={error || ""} />;
    }
    const localizedItem = getLocalizedData(info);

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Profile Card */}
                <div
                    ref={profileCardRef} // ---
                    className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="relative">
                        {/* Decorative Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 z-0"></div>

                        {/* Profile Header */}
                        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center">
                            <div className="relative mb-6 md:mb-0 md:mr-8">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500/30 overflow-hidden">
                                    <img
                                        src={localizedItem.avatar}
                                        alt={localizedItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 bg-gray-900 rounded-full p-2 border-2 border-purple-500">
                                    <span className="text-xl">
                                        {localizedItem.status}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold text-gray-100 mb-1">
                                    {localizedItem.name}
                                </h2>
                                <Link
                                    href={`https://t.me/${localizedItem.username}`}
                                    className="text-purple-400 text-lg mb-4"
                                >
                                    @{localizedItem.username}
                                </Link>

                                <div className="flex justify-center md:justify-start space-x-4">
                                    {localizedItem.links.telegram_channel && (
                                        <a
                                            href={
                                                localizedItem.links
                                                    .telegram_channel
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-purple-400 transition-colors"
                                            aria-label="Telegram"
                                        >
                                            <FaTelegram size={24} />
                                        </a>
                                    )}

                                    {localizedItem.links.website && (
                                        <a
                                            href={localizedItem.links.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-purple-400 transition-colors"
                                            aria-label="Website"
                                        >
                                            <FaGlobe size={24} />
                                        </a>
                                    )}

                                    {localizedItem.links.github && (
                                        <a
                                            href={localizedItem.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-purple-400 transition-colors"
                                            aria-label="GitHub"
                                        >
                                            <FaGithub size={24} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="p-8 border-t border-gray-800">
                        <h3 className="text-xl font-bold text-gray-100 mb-4">
                            Bio
                        </h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {localizedItem.description}
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-gray-800/30">
                        <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-purple-400 mb-1">
                                24
                            </div>
                            <div className="text-gray-400">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-purple-400 mb-1">
                                5+
                            </div>
                            <div className="text-gray-400">
                                Years Experience
                            </div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-purple-400 mb-1">
                                98%
                            </div>
                            <div className="text-gray-400">Satisfaction</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-purple-400 mb-1">
                                ∞
                            </div>
                            <div className="text-gray-400">Passion</div>
                        </div>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div
                    ref={philosophyRef} // ---
                    className="mt-12 bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">
                            {t("philosophyTitle")}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-800/50 rounded-xl">
                                <div className="text-purple-400 mb-3">
                                    <FaHeart size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-100 mb-2">
                                    {t("passionTitle")}
                                </h3>
                                <p className="text-gray-300">
                                    {t("passionText")}
                                </p>
                            </div>

                            <div className="p-6 bg-gray-800/50 rounded-xl">
                                <div className="text-purple-400 mb-3">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-100 mb-2">
                                    {t("innovationTitle")}
                                </h3>
                                <p className="text-gray-300">
                                    {t("innovationText")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div
                    ref={ctaRef} // ---
                    className="mt-12 text-center p-8 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl border border-purple-500/20"
                >
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">
                        {t("ctaTitle")}
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                        {t("ctaText")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {localizedItem.links.telegram_channel && (
                            <Link
                                href={`https://t.me/${localizedItem.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors flex items-center"
                            >
                                <FaTelegram className="mr-2" />
                                {t("telegramButton")}
                            </Link>
                        )}
                        {localizedItem.links.github && (
                            <a
                                href={localizedItem.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gray-800 text-gray-100 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
                            >
                                <FaGithub className="mr-2" />
                                {t("githubButton")}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

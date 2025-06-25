"use client";

import { locales, defaultLocales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useState, useRef } from "react";
import { getCookie } from "cookies-next";
import { FiGlobe, FiChevronDown } from "react-icons/fi";

interface LanguageSwitcherProps {
    locale?: string;
}

const languageNames: Record<string, string> = {
    ru: "Руский",
    en: "English",
};

const LanguageSwitcher = ({}: LanguageSwitcherProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [currentLocale, setCurrentLocale] = useState<string>(defaultLocales);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = getCookie("NEXT_LOCALE")?.toString() || defaultLocales;
        setCurrentLocale(saved);
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [open]);

    const handleChange = (locale: string) => {
        if (locale === currentLocale) return;
        setCurrentLocale(locale);
        router.replace(pathname, { locale });
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className={`
                    flex items-center gap-2 px-3 py-2
                    rounded-md bg-white/10 hover:bg-white/20
                    transition-colors
                `}
            >
                <FiGlobe className="text-blue-400" size={18} />
                <span className="text-white font-medium tracking-wider">
                    {languageNames[currentLocale] ||
                        currentLocale.toUpperCase()}
                </span>
                <FiChevronDown
                    className={`text-white transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                    size={16}
                />
            </button>
            {open && (
                <div
                    className={`
                        absolute right-0 mt-2 w-28 z-50
                        rounded-xl shadow-xl bg-gray-900 border border-gray-700/50
                        overflow-hidden animate-fade-in
                    `}
                >
                    {locales.map((locale) => (
                        <button
                            key={locale}
                            onClick={() => handleChange(locale)}
                            className={`
                                w-full px-4 py-3 flex items-center gap-3 text-left
                                hover:bg-blue-900/30 transition-colors
                                ${
                                    currentLocale === locale
                                        ? "bg-blue-900/50 font-semibold text-blue-300"
                                        : "text-gray-200"
                                }
                            `}
                        >
                            <span className="text-sm">
                                {languageNames[locale]}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;

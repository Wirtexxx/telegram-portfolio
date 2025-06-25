"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import type { GalleryItem } from "@/types";
import TryAgain from "@/components/TryAgain/TryAgain";
import Image from "next/image";
import { Page } from "@/components/Page";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GallerySlugPage() {
    const t = useTranslations("Gallery");
    const locale = useLocale();
    const params = useParams();
    const router = useRouter();

    const [item, setItem] = useState<GalleryItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/gallery");
                if (!response.ok)
                    throw new Error("Failed to fetch gallery data");
                const data = await response.json();
                const found = data.find((el: GalleryItem) => el.slug === slug);
                if (!found) throw new Error("Not found");
                setItem(found);
            } catch {
                setError("Not found");
            }
        };

        if (slug) fetchData();
    }, [slug]);

    const getLocalizedData = (item: GalleryItem) => ({
        ...item,
        title: item.title[locale] || item.title.en || "",
        description: item.description[locale] || item.description.en || "",
        price: item.price[locale] || item.price.en || "",
        review: item.review[locale] || item.review.en || "",
    });

    if (error || !item) {
        return <TryAgain error={error || ""} />;
    }

    const localizedItem = getLocalizedData(item);

    return (
        <Page>
            <div className="bg-gray-950 flex flex-col items-center px-4 py-8">
                <div
                    className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        background: `${item.color}10`,
                        border: `1px solid ${item.color}`,
                    }}
                >
                    <div className="w-full h-72 bg-gray-800 flex items-center justify-center overflow-hidden">
                        <Swiper
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="w-full h-72"
                        >
                            {item.img.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <Image
                                        src={img}
                                        alt={localizedItem.title}
                                        width={288}
                                        height={288}
                                        className="object-contain max-h-full max-w-full mx-auto"
                                        priority={idx === 0}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="p-8 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                                {localizedItem.title}
                            </h1>
                            <span className="text-xl font-bold text-gray-100 bg-gray-800 px-3 py-1 rounded-lg">
                                {localizedItem.price}
                            </span>
                        </div>
                        <p className="text-gray-300 text-lg">
                            {localizedItem.description}
                        </p>
                        {localizedItem.review && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                                    {t("review")}
                                </h3>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-gray-300 italic">
                                        {localizedItem.review}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[200px] text-center bg-gray-800 hover:bg-gray-700 text-gray-100 py-3 px-6 rounded-lg transition-colors font-medium"
                            >
                                {t("visitWebsite") || "Visit Website"}
                            </a>
                            <button
                                onClick={() => router.back()}
                                className="flex-1 min-w-[120px] text-center bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-6 rounded-lg transition-colors"
                            >
                                {t("back") || "Back"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

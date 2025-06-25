"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import type { GalleryItem } from "@/types";
import TryAgain from "@/components/TryAgain/TryAgain";
import { Page } from "@/components/Page";
import { MdArrowOutward } from "react-icons/md";

import Image from "next/image";

export default function GalleryPage() {
    const t = useTranslations("Gallery");
    const locale = useLocale();
    const router = useRouter();

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/gallery");
                if (!response.ok)
                    throw new Error("Failed to fetch gallery data");
                const data = await response.json();
                setItems(data);
            } catch {
                setError("An error occurred");
            }
        };

        fetchData();
    }, []);

    const getLocalizedData = (item: GalleryItem) => ({
        ...item,
        title: item.title[locale] || item.title.en || "",
        description: item.description[locale] || item.description.en || "",
        price: item.price[locale] || item.price.en || "",
        review: item.review[locale] || item.review.en || "",
    });

    if (error) {
        return <TryAgain error={error} />;
    }

    return (
        <Page>
            <div className="bg-gray-950 flex flex-col justify-center items-center pb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-10">
                    {t("title")}
                </h1>

                {/* SWIPER 3D COVERFLOW */}
                <div className="flex-1 w-full flex justify-center items-center">
                    <div className="w-full max-w-5xl flex justify-center mx-auto h-[520px]">
                        <Swiper
                            modules={[Navigation, EffectCoverflow]}
                            effect="coverflow"
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView="auto"
                            spaceBetween={30}
                            coverflowEffect={{
                                rotate: 5,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                                slideShadows: true,
                            }}
                            className="mySwiper h-full"
                            breakpoints={{
                                640: {
                                    coverflowEffect: {
                                        rotate: 10,
                                        depth: 150,
                                        modifier: 3,
                                    },
                                    spaceBetween: 40,
                                },
                                1024: {
                                    coverflowEffect: {
                                        rotate: 15,
                                        depth: 200,
                                        modifier: 3.5,
                                    },
                                    spaceBetween: 50,
                                },
                            }}
                        >
                            {items.map((item) => {
                                const localizedItem = getLocalizedData(item);
                                return (
                                    <SwiperSlide
                                        key={item.slug}
                                        style={{
                                            width: "280px",
                                            height: "520px",
                                            borderRadius: "20px",
                                            overflow: "hidden",
                                            position: "relative",
                                            background: item.color,
                                            boxShadow:
                                                "0 15px 30px rgba(0,0,0,0.5)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            router.push(`/gallery/${item.slug}`)
                                        }
                                    >
                                        <div className="w-full h-full flex flex-col">
                                            <div className="relative h-3/5">
                                                <Image
                                                    src={item.img[0]}
                                                    alt={localizedItem.title}
                                                    className="w-full h-full object-cover"
                                                    width={280}
                                                    height={520}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            </div>

                                            <div className="flex-1 flex flex-col p-5 bg-gradient-to-b from-gray-900 to-gray-950">
                                                <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-1">
                                                    {localizedItem.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                                                    {localizedItem.description}
                                                </p>

                                                <div className="flex justify-between items-end mt-auto">
                                                    <div
                                                        className={`px-4 py-1 rounded-full flex gap-2 items-center`}
                                                        style={{
                                                            background: `${item.color}`,
                                                        }}
                                                    >
                                                        {t("viewDetails")}
                                                        <MdArrowOutward />
                                                    </div>
                                                    <span className="text-lg font-bold text-gray-100">
                                                        {localizedItem.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            </div>
        </Page>
    );
}

import { defineRouting } from "next-intl/routing";
import { locales, defaultLocales } from "./config";

export const routing = defineRouting({
    locales: locales,

    defaultLocale: defaultLocales,
});

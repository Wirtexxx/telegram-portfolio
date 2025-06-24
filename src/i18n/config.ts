export type Locales = (typeof locales)[number];
export const locales = ["ru", "en"] as const;
export const defaultLocales: Locales = "ru";

import { cookies } from "next/headers";
import { defaultLocale, LOCALE_COOKIE, messages, type Locale } from "./messages";

export function parseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : defaultLocale;
}

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return parseLocale(jar.get(LOCALE_COOKIE)?.value);
}

export async function getMessages() {
  const locale = await getLocale();
  return { locale, t: messages[locale] };
}

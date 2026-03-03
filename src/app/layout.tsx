/**
 * RootLayout
 *
 * Global layout for the entire application.
 *
 * Responsibilities:
 * - Reads the locale from cookies on the server.
 * - Validates and determines the active language.
 * - Loads the corresponding translation messages.
 * - Provides internationalization via NextIntlClientProvider.
 * - Initializes the custom LangProvider for client-side locale control.
 *
 * Ensures proper synchronization between Server and Client Components,
 * delivering a fully localized and SEO-friendly application.
 */

import "./globals.css"
import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"

import { getMessages } from "@/i18n/get-messages"
import { LangProvider, type Locale } from "@/app/providers/LangContext"

const COOKIE_NAME = "NEXT_LOCALE"
const DEFAULT_LOCALE: Locale = "pt"

function isLocale(value: string | undefined): value is Locale {
  return value === "pt" || value === "en" || value === "es"
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // ✅ cookies() is async in your Next.js version/runtime
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value

  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE
  const messages = await getMessages(locale)

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LangProvider initialLocale={locale}>{children}</LangProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
/**
 * Root layout of the application.
 *
 * This layout initializes global application behavior. It loads global styles,
 * determines the user's preferred locale from cookies, falls back to a default
 * locale when necessary, and loads the corresponding translation messages.
 *
 * It then wraps the entire application with the NextIntl provider and the
 * application's global Providers component, making localization and shared
 * contexts available throughout all pages and components.
 */

import "./globals.css"
import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"

import { getMessages } from "@/i18n/get-messages"
import { Providers } from "@/app/providers"
import type { Locale } from "@/context/lang-context"

const COOKIE_NAME = "NEXT_LOCALE"
const DEFAULT_LOCALE: Locale = "pt"

function isLocale(value: string | undefined): value is Locale {
  return value === "pt" || value === "en" || value === "es"
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value

  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE
  const messages = await getMessages(locale)

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers initialLocale={locale}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
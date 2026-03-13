/* Global client-side providers wrapper.
*
* This component wraps the application with the main context providers
* used across the app:
*
* - SessionProvider: manages user authentication session (NextAuth).
* - LangProvider: provides global language and localization support.
* - ToastProvider: handles UI notifications and toast messages.
*
* The "use client" directive is required because these providers rely on
* React context and client-side state.
*/

"use client"

import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

import { LangProvider, type Locale } from "../context/lang-context"
import { ToastProvider } from "@/components/ui/toast"

export function Providers({
  children,
  session,
  initialLocale,
}: {
  children: ReactNode
  session?: Session | null
  initialLocale: Locale
}) {
  return (
    <SessionProvider session={session}>
      <LangProvider initialLocale={initialLocale}>
        <ToastProvider>{children}</ToastProvider>
      </LangProvider>
    </SessionProvider>
  )
}
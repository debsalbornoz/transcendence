/**
 * Providers
 *
 * Centralized client-side provider wrapper for the application.
 *
 * Responsibilities:
 * - Provides authentication context via NextAuth's SessionProvider.
 * - Supplies global language state through LangProvider.
 * - Enables global notification handling via ToastProvider.
 *
 * This component prevents provider nesting inside layouts
 * and ensures all application routes have access to
 * authentication, internationalization, and UI feedback systems.
 */

"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { LangProvider } from "./providers/LangContext"
import { ToastProvider } from "@/components/ui/toast"

export function Providers({
  children,
  session,
}: {
  children: ReactNode
  session?: any
}) {
  return (
    <SessionProvider session={session}>
      <LangProvider>
      <ToastProvider>{children}</ToastProvider>
      </LangProvider>
    </SessionProvider>
  )
}


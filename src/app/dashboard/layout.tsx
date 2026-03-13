/**
 * Dashboard layout wrapper.
 *
 * This server-side layout defines the common structure used across
 * all dashboard pages in the application.
 *
 * The layout:
 * - retrieves the authenticated session using NextAuth
 * - extracts the current tenant name from the session
 * - renders the TopBar with the active tenant context
 * - provides a language switcher for changing the application locale
 * - wraps all dashboard pages inside a centered container layout
 *
 * It ensures a consistent UI structure for all routes inside the
 * dashboard section of the application.
 */

import { ReactNode } from "react"
import { getServerSession } from "next-auth"

import { TopBar } from "@/components/layout/topbar"
import { LangSwitcher } from "@/components/ui/lang-switcher"
import { authOptions } from "@/lib/auth-options"

type DashboardLayoutProps = {
  children: ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  const tenantName = session?.user?.tenantName || "Empresa"

  return (
    <div className="relative min-h-screen bg-[#070B17]">
      <TopBar tenantName={tenantName} />

      {/* Language switcher */}
      <div className="absolute right-6 top-[110px] z-20">
        <LangSwitcher />
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  )
}
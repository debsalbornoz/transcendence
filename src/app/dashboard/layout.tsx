import { ReactNode } from "react"
import { getServerSession } from "next-auth"

import { TopBar } from "@/components/layout/topbar"
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
    <div className="min-h-screen bg-[#070B17]">
      <TopBar tenantName={tenantName} />

      <main className="mx-auto w-full max-w-7xl px-6 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  )
}
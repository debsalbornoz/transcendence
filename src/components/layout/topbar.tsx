"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import {
  Bell,
  ChevronDown,
  Settings,
  BarChart3,
  Users,
  Shield,
  UserCircle2,
  LogOut,
} from "lucide-react"

type TopBarProps = {
  tenantName?: string | null
}

export function TopBar({ tenantName }: TopBarProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const userName = session?.user?.name || session?.user?.email || "Usuária"
  const userImage = session?.user?.image || null

  const role =
    session?.user?.roles?.[0] ||
    (session?.user as { role?: string | null } | undefined)?.role ||
    "User"

  const companyName =
    tenantName ||
    session?.user?.tenantName ||
    "Workspace"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const isAdmin = role === "Admin"

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B17]/90 backdrop-blur-xl">
      <div className="w-full px-6 py-4 md:px-8">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Empresa
            </p>
            <h1 className="truncate text-xl font-semibold text-white md:text-2xl">
              {companyName}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-4" ref={containerRef}>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
                aria-expanded={open}
                aria-haspopup="menu"
              >
                <Avatar name={userName} image={userImage} />

                <div className="hidden text-left sm:block">
                  <p className="max-w-[180px] truncate text-sm font-medium text-white">
                    {userName}
                  </p>
                  <span className="mt-1 inline-flex rounded-full border border-purple-400/20 bg-purple-500/15 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                    {role}
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-3 w-[280px] overflow-hidden rounded-3xl border border-white/10 bg-[#0E1325]/95 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50">
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="truncate text-base font-semibold text-white">
                      {userName}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/15 px-2.5 py-1 text-xs font-medium text-purple-300">
                        {role}
                      </span>
                    </div>
                  </div>

                  <div className="py-2">
                    <DropdownItem
                      href="/profile"
                      icon={<UserCircle2 className="h-4 w-4" />}
                      label="Meu perfil"
                      onNavigate={() => setOpen(false)}
                    />

                    <DropdownItem
                      href="/settings"
                      icon={<Settings className="h-4 w-4" />}
                      label="Configurações"
                      onNavigate={() => setOpen(false)}
                    />

                    <DropdownItem
                      href="/analytics"
                      icon={<BarChart3 className="h-4 w-4" />}
                      label="Analytics"
                      onNavigate={() => setOpen(false)}
                    />

                    <DropdownItem
                      href="/dashboard/users"
                      icon={<Users className="h-4 w-4" />}
                      label="Equipe"
                      onNavigate={() => setOpen(false)}
                    />

                    {isAdmin && (
                      <DropdownItem
                        href="/dashboard"
                        icon={<Shield className="h-4 w-4" />}
                        label="Administração"
                        onNavigate={() => setOpen(false)}
                      />
                    )}
                  </div>

                  <div className="border-t border-white/10 p-2">
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function DropdownItem({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="mx-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
    >
      <span className="text-gray-400">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function Avatar({
  name,
  image,
}: {
  name: string
  image: string | null
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-11 w-11 rounded-full border border-white/10 object-cover"
      />
    )
  }

  const initial = name.trim().charAt(0).toUpperCase() || "U"

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-400/15 bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-sm font-semibold text-white">
      {initial}
    </div>
  )
}

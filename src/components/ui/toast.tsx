/**
 * Toast System (ToastProvider + useToast)
 *
 * Lightweight global notification system built using React Context.
 *
 * Features:
 * - Provides a `push` function to trigger toast notifications from anywhere.
 * - Supports multiple variants: neutral, success, danger, and info.
 * - Automatically removes toasts after a configurable duration.
 * - Renders stacked toasts in a fixed top-right container.
 * - Includes smooth entrance animation.
 * - Enforces proper usage via `useToast` hook guard.
 *
 * Architecture:
 * - ToastProvider manages internal toast state.
 * - useToast() exposes a safe API for triggering notifications.
 * - Toast items are rendered globally above the app (z-index layered).
 *
 * Designed to provide consistent, non-blocking feedback
 * for user actions such as form submissions, errors,
 * confirmations, and system messages.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastVariant = "neutral" | "success" | "danger" | "info"

type ToastItem = {
  id: string
  title?: string
  message: string
  variant: ToastVariant
  durationMs: number
}

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id">) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />")
  return ctx
}

function variantClass(v: ToastVariant) {
  if (v === "success")
    return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
  if (v === "danger")
    return "border-[rgb(var(--danger))]/25 bg-[rgb(var(--danger))]/10 text-red-100"
  if (v === "info")
    return "border-[rgb(var(--info))]/25 bg-[rgb(var(--info))]/10 text-blue-100"
  return "border-white/10 bg-white/5 text-white"
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  const push = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random())
    const item: ToastItem = { id, ...t }
    setItems((prev) => [item, ...prev])

    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id))
    }, t.durationMs)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}

      <div className="fixed right-5 top-5 z-[80] flex w-[min(420px,calc(100vw-40px))] flex-col gap-3">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-2xl border px-4 py-3",
              "bg-[rgb(var(--card))]/85 backdrop-blur-xl",
              "shadow-[0_0_50px_rgba(0,0,0,0.55)]",
              "animate-[toastIn_180ms_ease-out]",
              variantClass(t.variant)
            )}
          >
            {t.title && (
              <div className="text-sm font-semibold leading-5">{t.title}</div>
            )}
            <div className="text-sm text-[rgb(var(--muted))]">{t.message}</div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
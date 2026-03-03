/**
 * Modal
 *
 * Reusable controlled modal dialog component designed for overlays,
 * confirmations, and focused interactions.
 *
 * Features:
 * - Controlled visibility via the `open` prop.
 * - Closes when:
 *     • Clicking on the background overlay
 *     • Pressing the ESC key
 * - Accessible dialog semantics (role="dialog", aria-modal="true").
 * - Optional title and description header section.
 * - Flexible content area (children) and optional footer.
 * - Smooth entrance animation (fade + scale effect).
 * - Glassmorphism-style panel with backdrop blur and shadow depth.
 *
 * Designed to provide consistent modal behavior and styling
 * across the application while maintaining accessibility
 * and clean separation of concerns.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      {/* overlay */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative mx-auto flex min-h-screen max-w-2xl items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full rounded-2xl border border-white/10",
            "bg-[rgb(var(--card))]/92 backdrop-blur-xl",
            "shadow-[0_0_80px_rgba(0,0,0,0.7)]",
            "p-6 md:p-7",
            "animate-[modalIn_180ms_ease-out]",
            className
          )}
        >
          {(title || description) && (
            <div className="mb-4 space-y-1">
              {title && (
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-[rgb(var(--muted))]">{description}</p>
              )}
            </div>
          )}

          <div className="space-y-4">{children}</div>

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
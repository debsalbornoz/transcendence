/**
 * Badge
 *
 * Reusable status indicator component designed for labeling
 * or highlighting small pieces of information.
 *
 * Features:
 * - Supports multiple semantic variants (neutral, primary, success,
 *   warning, danger, info).
 * - Uses design tokens and Tailwind utilities for consistent styling.
 * - Accepts custom className for additional styling flexibility.
 * - Designed to be lightweight and inline-friendly.
 *
 * Common use cases:
 * - Status indicators (e.g., Active, Pending, Error).
 * - Category labels.
 * - Small contextual metadata tags.
 *
 * Part of the application's design system, ensuring consistent
 * visual language across the UI.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "info"

const variants: Record<BadgeVariant, string> = {
  neutral:
    "bg-white/5 text-[rgb(var(--text))] border-white/10",
  primary:
    "bg-[rgb(var(--primary))]/15 text-[rgb(var(--text))] border-[rgb(var(--primary))]/30",
  success:
    "bg-emerald-500/15 text-emerald-100 border-emerald-400/30",
  warning:
    "bg-[rgb(var(--accent))]/15 text-orange-100 border-[rgb(var(--accent))]/30",
  danger:
    "bg-[rgb(var(--danger))]/15 text-red-100 border-[rgb(var(--danger))]/30",
  info:
    "bg-[rgb(var(--info))]/15 text-blue-100 border-[rgb(var(--info))]/30",
}

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
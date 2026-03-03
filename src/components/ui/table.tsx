/**
 * Table Components
 *
 * A set of reusable, styled table primitives designed to provide
 * consistent structure and appearance across data-driven views.
 *
 * Components:
 * - Table: Wrapper container with rounded corners, border,
 *   background styling, and horizontal scroll support.
 * - THead: Styled table header section with subtle background
 *   and bottom border separation.
 * - TH: Header cell with uppercase, muted, small-label styling.
 * - TR: Table row with border separation and hover state feedback.
 * - TD: Data cell with consistent padding and readable text styling.
 *
 * Features:
 * - Dark-themed styling aligned with design tokens.
 * - Responsive horizontal scrolling for overflow handling.
 * - Hover interaction for improved row readability.
 * - Modular structure for flexible table composition.
 *
 * Designed to standardize data presentation and maintain
 * visual consistency across dashboards, lists, and reports.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Table({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
        className
      )}
    >
      <div className="w-full overflow-auto">{children}</div>
    </div>
  )
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-white/5 border-b border-white/10">{children}</thead>
  )
}

export function TH({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]",
        className
      )}
    >
      {children}
    </th>
  )
}

export function TR({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <tr
      className={cn(
        "border-b border-white/10 last:border-b-0 hover:bg-white/3 transition",
        className
      )}
    >
      {children}
    </tr>
  )
}

export function TD({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <td className={cn("px-4 py-3 text-sm text-white/90", className)}>
      {children}
    </td>
  )
}
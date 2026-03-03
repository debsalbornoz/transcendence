/**
 * Divider
 *
 * Reusable horizontal separator component with optional centered label.
 *
 * Features:
 * - Renders a full-width horizontal line.
 * - Optionally displays a centered label overlapping the line.
 * - Supports custom styling through className overrides
 *   (container, line, and label).
 * - Designed to integrate seamlessly with the application's
 *   design tokens (e.g., muted text and card background colors).
 *
 * Common use cases:
 * - Separating sections within forms.
 * - Dividing authentication methods (e.g., "OR").
 * - Structuring content blocks with visual hierarchy.
 *
 * Part of the design system to ensure consistent spacing
 * and separation patterns across the UI.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Divider({
  label,
  className,
  lineClassName,
  labelClassName,
}: {
  label?: string
  className?: string
  lineClassName?: string
  labelClassName?: string
}) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn("absolute inset-0 flex items-center", lineClassName)}>
        <div className="w-full border-t border-white/10" />
      </div>

      {label ? (
        <span
          className={cn(
            "relative px-4 text-sm text-[rgb(var(--muted))] bg-[rgb(var(--card))]",
            labelClassName
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
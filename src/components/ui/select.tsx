/**
 * Select
 *
 * Reusable styled select component built on top of the native
 * HTML <select> element, enhanced with design system styling
 * and validation support.
 *
 * Features:
 * - Optional label linked via accessible htmlFor/id pairing.
 * - Displays contextual hint or validation error message.
 * - Automatically generates a unique id if none is provided.
 * - Applies consistent dark-themed styling aligned with design tokens.
 * - Adjusts border and focus styles when in error state.
 * - Extends all native HTML select attributes for flexibility.
 *
 * Designed for use in forms across the application,
 * ensuring consistent spacing, accessibility, and validation feedback.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  hint?: string
  error?: string
  containerClassName?: string
}

export function Select({
  label,
  hint,
  error,
  className,
  containerClassName,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? React.useId()

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[rgb(var(--text))]"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={cn(
          "h-11 w-full rounded-xl px-3",
          "bg-white/5 border border-white/10",
          "text-[rgb(var(--text))]",
          "outline-none transition",
          "focus:border-[rgb(var(--primary))]/40 focus:ring-2 focus:ring-[rgb(var(--primary))]/20",
          error ? "border-[rgb(var(--danger))]/40 focus:ring-[rgb(var(--danger))]/20" : "",
          className
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs text-[rgb(var(--danger))]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[rgb(var(--muted))]">{hint}</p>
      ) : null}
    </div>
  )
}
/**
 * Tabs
 *
 * Reusable controlled tab navigation component with animated
 * active indicator (pill-style selector).
 *
 * Features:
 * - Fully controlled via `value` and `onChange`.
 * - Supports generic string-based tab values for type safety.
 * - Animated sliding background indicator based on active index.
 * - Handles disabled tab states.
 * - Includes accessibility roles (tablist, tab, aria-selected, aria-disabled).
 * - Responsive layout with equal-width tab distribution.
 *
 * Designed to provide a clean and interactive way to switch
 * between related content sections while maintaining consistent
 * styling across the application's design system.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type TabItem<T extends string> = {
  value: T
  label: string
  disabled?: boolean
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: Array<TabItem<T>>
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.value === value)
  )

  return (
    <div
      className={cn(
        "relative inline-flex w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1",
        className
      )}
      role="tablist"
      aria-label="Tabs"
    >
      {/* Animated pill */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-xl bg-white/10 border border-white/10 transition-all duration-200"
        style={{
          left: `calc(${activeIndex} * (100% / ${items.length}) + 4px)`,
          width: `calc(100% / ${items.length} - 8px)`,
        }}
      />

      {items.map((item, idx) => {
        const isActive = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative z-10 flex-1 h-10 rounded-xl px-3 text-sm font-medium transition",
              "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/25",
              item.disabled
                ? "opacity-50 cursor-not-allowed text-[rgb(var(--muted))]"
                : isActive
                ? "text-white"
                : "text-[rgb(var(--muted))] hover:text-white"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
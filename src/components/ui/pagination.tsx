/**
 * Pagination
 *
 * Controlled pagination component designed to handle large data sets
 * with a clean and scalable page navigation interface.
 *
 * Features:
 * - Calculates total pages based on totalItems and pageSize.
 * - Automatically clamps the current page within valid bounds.
 * - Displays a smart page range with ellipsis (e.g., 1, 2, 3, ..., 10)
 *   when the total number of pages is large.
 * - Shows item range information (e.g., "Showing 11–20 of 125").
 * - Provides Previous and Next navigation buttons.
 * - Disables navigation controls when limits are reached.
 * - Fully controlled via `page` and `onPageChange` props.
 *
 * Designed to integrate with tables, lists, or search results,
 * ensuring consistent navigation behavior across the application.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Ex: [1, 2, 3, "...", 10]
function buildPages(current: number, total: number) {
  if (total <= 7) return range(1, total)

  const pages = new Set<number>()
  pages.add(1)
  pages.add(total)

  ;[current - 1, current, current + 1].forEach((p) => {
    if (p >= 1 && p <= total) pages.add(p)
  })

  const sorted = Array.from(pages).sort((a, b) => a - b)

  const result: Array<number | "..."> = []
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]
    const prev = sorted[i - 1]
    if (i > 0 && prev && p - prev > 1) result.push("...")
    result.push(p)
  }

  return result
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const current = clamp(page, 1, totalPages)
  const pages = buildPages(current, totalPages)

  const from = totalItems === 0 ? 0 : (current - 1) * pageSize + 1
  const to = Math.min(totalItems, current * pageSize)

  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="text-sm text-[rgb(var(--muted))]">
        Mostrando <span className="text-white">{from}</span>–<span className="text-white">{to}</span> de{" "}
        <span className="text-white">{totalItems}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(current - 1)}
          disabled={current <= 1}
          className={cn(
            "h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition",
            "hover:bg-white/8",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          Anterior
        </button>

        <div className="flex items-center gap-2">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-[rgb(var(--muted))]">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  "h-10 min-w-10 px-3 rounded-xl border text-sm font-medium transition",
                  p === current
                    ? "border-[rgb(var(--primary))]/35 bg-[rgb(var(--primary))]/15 text-white"
                    : "border-white/10 bg-white/5 text-[rgb(var(--muted))] hover:bg-white/8 hover:text-white"
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(current + 1)}
          disabled={current >= totalPages}
          className={cn(
            "h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition",
            "hover:bg-white/8",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
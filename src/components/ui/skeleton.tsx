/**
 * Skeleton
 *
 * Reusable loading placeholder component used to simulate content
 * while data is being fetched.
 *
 * Features:
 * - Displays a rounded container styled according to the design system.
 * - Includes a shimmer animation to indicate loading state.
 * - Accepts custom className for flexible sizing and layout adaptation.
 * - Uses a lightweight keyframe animation for smooth horizontal shimmer.
 *
 * Common use cases:
 * - Replacing text blocks, cards, or table rows during async loading.
 * - Improving perceived performance and user experience.
 *
 * Designed to maintain visual consistency while clearly
 * communicating loading states across the application.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Skeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-white/5 border border-white/10",
        className
      )}
    >
      <div className="absolute inset-0 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
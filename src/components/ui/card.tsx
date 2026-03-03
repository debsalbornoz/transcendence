/**
 * Card
 *
 * Reusable container component designed to wrap content with a
 * stylized glass-like surface and animated neon border.
 *
 * Features:
 * - Supports configurable padding sizes (sm, md, lg).
 * - Includes animated gradient border with subtle motion and hue shifting.
 * - Applies backdrop blur and semi-transparent dark background
 *   for a modern glassmorphism effect.
 * - Accepts custom className for layout flexibility.
 *
 * Intended as a foundational layout component within the design system,
 * ensuring consistent visual depth, spacing, and branding across
 * authentication screens and other UI sections.
 */

"use client"

import { cn } from "@/lib/utils"

type CardProps = {
  children: React.ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

export function Card({ children, className, padding = "md" }: CardProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div className="relative group">
      {/* Animated neon border layer (moves + slowly shifts colors) */}
      <div
        className="
          absolute -inset-[1px] rounded-2xl
          bg-[linear-gradient(90deg,rgba(59,130,246,0.95),rgba(139,92,246,0.95),rgba(59,130,246,0.95))]
          bg-[length:240%_240%]
          opacity-80 blur-sm
          animate-neon-border animate-neon-hue
        "
      />

      {/* Card surface */}
      <div
        className={cn(
          "relative rounded-2xl bg-[#0E1325]/85 backdrop-blur-xl border border-white/10",
          paddingStyles[padding],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
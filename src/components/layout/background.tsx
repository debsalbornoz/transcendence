/**
 * Background
 *
 * Reusable visual wrapper component responsible for rendering
 * the application's layered dark background.
 *
 * Provides:
 * - Base dark gradient for depth.
 * - Blue and orange glow effects for visual contrast.
 * - Radial vignette for focus and cinematic effect.
 * - Proper layering to keep foreground content interactive.
 *
 * Designed to ensure consistent branding and aesthetic
 * across authentication and other full-screen pages.
 */

import type { ReactNode } from "react"

export function Background({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#070B17]">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1025] via-[#070B17] to-black" />

        {/* Blue glow */}
        <div
          className="
            absolute -left-60 top-1/2 -translate-y-1/2
            w-[900px] h-[900px]
            bg-blue-600/35 rounded-full blur-[220px]
          "
        />

        {/* Orange glow */}
        <div
          className="
            absolute -bottom-40 right-0
            w-[600px] h-[600px]
            bg-orange-500/20 rounded-full blur-[200px]
          "
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
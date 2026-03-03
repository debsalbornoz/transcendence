/**
 * SocialButton
 *
 * Reusable authentication button component designed for social login providers
 * such as Google, GitHub, and Microsoft.
 *
 * Features:
 * - Supports provider-based visual variants (google, github, microsoft).
 * - Applies dynamic hover effects and glow styles depending on provider.
 * - Full-width layout optimized for authentication screens.
 * - Smooth hover animation with subtle elevation effect.
 * - Accepts custom content (icon + label) via children.
 *
 * Designed to provide consistent styling and interaction patterns
 * for third-party authentication options while maintaining
 * brand-aligned visual feedback.
 */

"use client"

import { ReactNode } from "react"

type Variant = "google" | "github" | "microsoft"

interface SocialButtonProps {
  children: ReactNode
  variant?: Variant
  onClick?: () => void
}

export function SocialButton({
  children,
  variant = "google",
  onClick,
}: SocialButtonProps) {
  const hover =
    variant === "google"
      ? "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
      : variant === "github"
      ? "hover:border-gray-400/40 hover:shadow-[0_0_30px_rgba(128,128,128,0.35)]"
      : "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full h-12",
        "flex items-center justify-center gap-4",
        "rounded-xl",
        "bg-[#111827] border border-white/10",
        "text-white font-medium",
        "transition-all duration-300",
        "hover:-translate-y-0.5",
        hover,
      ].join(" ")}
    >
      {children}
    </button>
  )
}
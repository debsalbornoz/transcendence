/**
 * Icon
 *
 * Reusable wrapper component for SVG icons that standardizes
 * sizing, accessibility, and layout behavior.
 *
 * Features:
 * - Supports predefined size variants (xs, sm, md, lg).
 * - Prevents layout breaking with shrink-0 enforcement.
 * - Merges custom className values safely.
 * - Enhances accessibility:
 *   - Applies role="img" and aria-label when a title is provided.
 *   - Defaults to aria-hidden when no accessible label is given.
 *   - Disables focus behavior for decorative icons.
 *
 * Designed to ensure consistent icon usage across the design system
 * while maintaining accessibility best practices.
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type IconSize = "xs" | "sm" | "md" | "lg"

const sizeMap: Record<IconSize, string> = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
}

export function Icon({
  children,
  size = "sm",
  className,
  title,
}: {
  children: React.ReactElement
  size?: IconSize
  className?: string
  title?: string
}) {
  // força tamanho + impede svg de estourar
  return React.cloneElement(children, {
    className: cn(sizeMap[size], "shrink-0", children.props.className, className),
    role: title ? "img" : children.props.role,
    "aria-label": title ? title : children.props["aria-label"],
    "aria-hidden": title ? undefined : children.props["aria-hidden"] ?? true,
    focusable: "false",
  })
}
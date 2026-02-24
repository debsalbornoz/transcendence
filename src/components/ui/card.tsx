"use client"

import { cn } from "@/lib/utils"

type CardProps = {
  children: React.ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

export function Card({ children, className, padding = "md" }: CardProps) {
  // Map padding sizes to Tailwind classes
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div className="relative group ">
      {/* Animated gradient border layer */}
      <div
        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r 
                  from-blue-600 via-purple-600 to-orange-500
                  opacity-70 blur-sm 
                  group-hover:opacity-100
                  transition duration-500
                  animate-border"
      />

      {/* Actual card content */}
      <div
        className={cn(
          "relative rounded-2xl bg-[#0E1325]/80 backdrop-blur-xl border border-white/10",
          paddingStyles[padding],
          className
        )}
      >
        {/* Render card content */}
        {children}
      </div>
    </div>
  )
}
"use client"
import type React from "react"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  return <>{children}</>
}

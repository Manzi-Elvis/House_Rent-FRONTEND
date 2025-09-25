"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "TENANT" | "LANDLORD"
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo || "/login")
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const dashboardPath = user?.role === "LANDLORD" ? "/landlord/dashboard" : "/tenant/dashboard"
        router.push(dashboardPath)
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}

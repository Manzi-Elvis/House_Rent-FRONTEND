import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { TenantSidebar } from "@/components/tenant/tenant-sidebar"
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav"

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="TENANT">
      <div className="flex h-screen bg-background">
        <TenantSidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="container mx-auto p-6">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </AuthGuard>
  )
}

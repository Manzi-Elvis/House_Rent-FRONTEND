import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { LandlordSidebar } from "@/components/landlord/landlord-sidebar"
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav"

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="LANDLORD">
      <div className="flex h-screen bg-background">
        <LandlordSidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="container mx-auto p-6">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </AuthGuard>
  )
}

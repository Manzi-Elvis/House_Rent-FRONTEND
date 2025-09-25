"use client"

import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, FileText, Receipt, Building, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const tenantNavigation = [
  { name: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/tenant/invoices", icon: FileText },
  { name: "Receipts", href: "/tenant/receipts", icon: Receipt },
]

const landlordNavigation = [
  { name: "Dashboard", href: "/landlord/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/landlord/properties", icon: Building },
  { name: "Tenants", href: "/landlord/tenants", icon: Users },
  { name: "Payments", href: "/landlord/payments", icon: CreditCard },
]

export function MobileBottomNav() {
  const { user } = useAuth()
  const pathname = usePathname()

  const navigation = user?.role === "LANDLORD" ? landlordNavigation : tenantNavigation

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <nav className="flex">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
                isActive
                  ? user?.role === "LANDLORD"
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                    : "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

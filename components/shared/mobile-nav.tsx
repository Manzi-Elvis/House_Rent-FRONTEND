"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Menu,
  LayoutDashboard,
  FileText,
  Receipt,
  Building,
  Users,
  CreditCard,
  BarChart3,
  Building2,
} from "lucide-react"
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
  { name: "Invoices", href: "/landlord/invoices", icon: FileText },
  { name: "Reports", href: "/landlord/reports", icon: BarChart3 },
]

export function MobileNav() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navigation = user?.role === "LANDLORD" ? landlordNavigation : tenantNavigation
  const brandColor = user?.role === "LANDLORD" ? "text-emerald-600" : "text-blue-600"

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-5 border-b">
              <Building2 className={`h-8 w-8 ${brandColor}`} />
              <span className="ml-2 text-xl font-bold">BizRent</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? user?.role === "LANDLORD"
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                          : "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive
                          ? user?.role === "LANDLORD"
                            ? "text-emerald-600"
                            : "text-blue-600"
                          : "text-muted-foreground",
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

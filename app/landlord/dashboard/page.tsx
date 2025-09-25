"use client"

import { useLandlordDashboard } from "@/hooks/use-landlord-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Building, Users, DollarSign, AlertTriangle, TrendingUp, Home } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function LandlordDashboard() {
  const { data: stats, isLoading } = useLandlordDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your property management business</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats?.totalProperties || 0,
      description: "Active properties",
      icon: Building,
      color: "text-blue-600",
    },
    {
      title: "Total Units",
      value: stats?.totalUnits || 0,
      description: "Rental units",
      icon: Home,
      color: "text-emerald-600",
    },
    {
      title: "Total Tenants",
      value: stats?.totalTenants || 0,
      description: "Active tenants",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Occupancy Rate",
      value: `${Math.round((stats?.occupancyRate || 0) * 100)}%`,
      description: "Units occupied",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.monthlyRevenue || 0),
      description: "This month's income",
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments || 0,
      description: "Awaiting approval",
      icon: AlertTriangle,
      color: "text-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-balance">Overview of your property management business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentPayments?.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {payment.tenant?.firstName} {payment.tenant?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        payment.status === "APPROVED"
                          ? "default"
                          : payment.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                    <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  </div>
                </div>
              )) || <p className="text-muted-foreground text-center py-4">No recent payments</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.overdueInvoices && stats.overdueInvoices > 0 ? (
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">Overdue Invoices</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {stats.overdueInvoices} invoice{stats.overdueInvoices > 1 ? "s" : ""} past due
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">{stats.overdueInvoices}</Badge>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No overdue invoices</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

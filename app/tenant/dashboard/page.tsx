"use client"

import { useTenantDashboard } from "@/hooks/use-tenant-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function TenantDashboard() {
  const { data: stats, isLoading } = useTenantDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your rental overview.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
      title: "Total Due",
      value: formatCurrency(stats?.totalDue || 0),
      description: "Outstanding balance",
      icon: DollarSign,
      color: "text-red-600",
    },
    {
      title: "Paid This Month",
      value: formatCurrency(stats?.paidThisMonth || 0),
      description: "Current month payments",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments || 0,
      description: "Awaiting approval",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      title: "Overdue Invoices",
      value: stats?.overdueInvoices || 0,
      description: "Require immediate attention",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-balance">Welcome back! Here's your rental overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentInvoices?.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        invoice.status === "PAID"
                          ? "default"
                          : invoice.status === "OVERDUE"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                  </div>
                </div>
              )) || <p className="text-muted-foreground text-center py-4">No recent invoices</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentPayments?.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment #{payment.transactionId}</p>
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
      </div>
    </div>
  )
}

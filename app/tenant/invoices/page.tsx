"use client"

import { useState } from "react"
import { useTenantInvoices } from "@/hooks/use-tenant-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export default function TenantInvoices() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { data, isLoading } = useTenantInvoices({ status: statusFilter })

  const filteredInvoices = data?.invoices?.filter((invoice) =>
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage your rental invoices and payments</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Invoices</h1>
        <p className="text-muted-foreground text-balance">Manage your rental invoices and payments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredInvoices?.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{invoice.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()} •{" "}
                    {invoice.unit?.unitNumber && `Unit ${invoice.unit.unitNumber}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      invoice.status === "PAID" ? "default" : invoice.status === "OVERDUE" ? "destructive" : "secondary"
                    }
                  >
                    {invoice.status}
                  </Badge>
                  <span className="text-xl font-bold">{formatCurrency(invoice.amount)}</span>
                  <Button asChild size="sm">
                    <Link href={`/tenant/invoices/${invoice.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No invoices found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

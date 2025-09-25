"use client"

import { useState } from "react"
import { useLandlordInvoices, useGenerateInvoices } from "@/hooks/use-landlord-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, FileText, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function LandlordInvoices() {
  const { data: invoices, isLoading } = useLandlordInvoices()
  const generateInvoices = useGenerateInvoices()
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const handleGenerateInvoices = () => {
    if (selectedMonth && selectedYear) {
      generateInvoices.mutate(
        { month: selectedMonth, year: selectedYear },
        {
          onSuccess: () => {
            setIsGenerateDialogOpen(false)
            setSelectedMonth("")
            setSelectedYear("")
          },
        },
      )
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Generate and manage tenant invoices</p>
          </div>
          <Skeleton className="h-10 w-40" />
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-balance">Invoices</h1>
          <p className="text-muted-foreground text-balance">Generate and manage tenant invoices</p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Invoices
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Monthly Invoices</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate invoices for all active tenants for the selected month and year.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleGenerateInvoices}
                  disabled={generateInvoices.isPending || !selectedMonth || !selectedYear}
                  className="flex-1"
                >
                  {generateInvoices.isPending ? "Generating..." : "Generate Invoices"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsGenerateDialogOpen(false)}
                  disabled={generateInvoices.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {invoices?.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{invoice.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.tenant?.firstName} {invoice.tenant?.lastName} •{" "}
                      {invoice.unit?.unitNumber && `Unit ${invoice.unit.unitNumber} • `}
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
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
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices generated yet</p>
              <p className="text-sm text-muted-foreground mt-2">Generate your first batch of monthly invoices</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, TrendingUp, DollarSign } from "lucide-react"

export default function LandlordReports() {
  const reports = [
    {
      title: "Monthly Revenue Report",
      description: "Detailed breakdown of rental income by property and unit",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Occupancy Report",
      description: "Vacancy rates and occupancy trends across all properties",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Payment History Report",
      description: "Complete payment records and transaction history",
      icon: FileText,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Reports</h1>
        <p className="text-muted-foreground text-balance">Generate and export business reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className={`h-5 w-5 ${report.color}`} />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 text-balance">{report.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-balance">
            Create custom reports with specific date ranges and filters. This feature will be available in a future
            update.
          </p>
          <Button disabled>Coming Soon</Button>
        </CardContent>
      </Card>
    </div>
  )
}

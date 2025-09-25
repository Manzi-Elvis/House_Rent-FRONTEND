"use client"

import { useTenantReceipts } from "@/hooks/use-tenant-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function TenantReceipts() {
  const { data: receipts, isLoading } = useTenantReceipts()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Receipts</h1>
          <p className="text-muted-foreground">Download your payment receipts</p>
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
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-9 w-24" />
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
        <h1 className="text-3xl font-bold text-balance">Receipts</h1>
        <p className="text-muted-foreground text-balance">Download your approved payment receipts</p>
      </div>

      <div className="space-y-4">
        {receipts?.map((receipt) => (
          <Card key={receipt.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{receipt.invoice?.description || "Payment Receipt"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Issued: {new Date(receipt.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">{formatCurrency(receipt.amount)}</span>
                  <Button asChild size="sm">
                    <a href={receipt.downloadUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <Card>
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No receipts available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Receipts will appear here once your payments are approved
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

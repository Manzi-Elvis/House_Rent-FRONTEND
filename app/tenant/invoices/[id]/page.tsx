"use client"

import type React from "react"

import { useState } from "react"
import { useTenantInvoice, useSubmitPayment } from "@/hooks/use-tenant-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Upload, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function InvoiceDetail() {
  const params = useParams()
  const invoiceId = params.id as string
  const { data: invoice, isLoading } = useTenantInvoice(invoiceId)
  const submitPayment = useSubmitPayment()

  const [transactionId, setTransactionId] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      // Validate file type
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        alert("Only JPG, PNG, and PDF files are allowed")
        return
      }
      setProofFile(file)
    }
  }

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) {
      alert("Please enter a transaction ID")
      return
    }

    submitPayment.mutate({
      invoiceId,
      transactionId: transactionId.trim(),
      proofFile: proofFile || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Invoice not found</p>
        <Button asChild className="mt-4">
          <Link href="/tenant/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Link>
        </Button>
      </div>
    )
  }

  const canMakePayment = invoice.status === "PENDING" || invoice.status === "OVERDUE"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/tenant/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-balance">Invoice Details</h1>
          <p className="text-muted-foreground text-balance">Review and make payment for your invoice</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="font-medium">{invoice.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={
                  invoice.status === "PAID" ? "default" : invoice.status === "OVERDUE" ? "destructive" : "secondary"
                }
              >
                {invoice.status}
              </Badge>
            </div>
            {invoice.unit && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit:</span>
                <span className="font-medium">{invoice.unit.unitNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {canMakePayment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Make Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showPaymentForm ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4 text-balance">
                    Ready to submit your payment? Click below to get started.
                  </p>
                  <Button onClick={() => setShowPaymentForm(true)} className="w-full">
                    Submit Payment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transactionId">Transaction ID *</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter your transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="proofFile">Payment Proof (Optional)</Label>
                    <div className="mt-2">
                      <Input
                        id="proofFile"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or PDF. Max 5MB.</p>
                    </div>
                    {proofFile && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        {proofFile.name} selected
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSubmitPayment}
                      disabled={submitPayment.isPending || !transactionId.trim()}
                      className="flex-1"
                    >
                      {submitPayment.isPending ? "Submitting..." : "Submit Payment"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentForm(false)}
                      disabled={submitPayment.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {invoice.payments && invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Transaction: {payment.transactionId}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(payment.submittedAt).toLocaleDateString()}
                    </p>
                    {payment.notes && <p className="text-sm text-muted-foreground mt-1">Note: {payment.notes}</p>}
                  </div>
                  <div className="flex items-center gap-4">
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

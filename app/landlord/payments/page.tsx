"use client"

import { useState } from "react"
import { useLandlordPayments, useApprovePayment, useRejectPayment } from "@/hooks/use-landlord-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, FileText } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Payment } from "@/lib/types"

export default function LandlordPayments() {
  const [statusFilter, setStatusFilter] = useState<string>("PENDING")
  const { data: payments, isLoading } = useLandlordPayments(statusFilter)
  const approvePayment = useApprovePayment()
  const rejectPayment = useRejectPayment()

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")

  const handleAction = () => {
    if (!selectedPayment || !actionType) return

    const mutation = actionType === "approve" ? approvePayment : rejectPayment
    mutation.mutate(
      { paymentId: selectedPayment.id, notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          setSelectedPayment(null)
          setActionType(null)
          setNotes("")
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Review and approve tenant payments</p>
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
        <h1 className="text-3xl font-bold text-balance">Payments</h1>
        <p className="text-muted-foreground text-balance">Review and approve tenant payments</p>
      </div>

      <div className="flex justify-between items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {payments?.map((payment: Payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {payment.tenant?.firstName} {payment.tenant?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Transaction: {payment.transactionId} • Submitted:{" "}
                    {new Date(payment.submittedAt).toLocaleDateString()}
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
                  <span className="text-xl font-bold">{formatCurrency(payment.amount)}</span>
                  <div className="flex gap-2">
                    {payment.proofUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {payment.status === "PENDING" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 bg-transparent"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setActionType("approve")
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Payment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>
                                Are you sure you want to approve this payment of{" "}
                                <strong>{formatCurrency(payment.amount)}</strong> from{" "}
                                <strong>
                                  {payment.tenant?.firstName} {payment.tenant?.lastName}
                                </strong>
                                ?
                              </p>
                              <div>
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Add any notes about this approval..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button onClick={handleAction} disabled={approvePayment.isPending} className="flex-1">
                                  {approvePayment.isPending ? "Approving..." : "Approve Payment"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedPayment(null)
                                    setActionType(null)
                                    setNotes("")
                                  }}
                                  disabled={approvePayment.isPending}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setActionType("reject")
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Payment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>
                                Are you sure you want to reject this payment of{" "}
                                <strong>{formatCurrency(payment.amount)}</strong> from{" "}
                                <strong>
                                  {payment.tenant?.firstName} {payment.tenant?.lastName}
                                </strong>
                                ?
                              </p>
                              <div>
                                <Label htmlFor="rejectNotes">Reason for Rejection</Label>
                                <Textarea
                                  id="rejectNotes"
                                  placeholder="Please provide a reason for rejecting this payment..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={handleAction}
                                  disabled={rejectPayment.isPending || !notes.trim()}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  {rejectPayment.isPending ? "Rejecting..." : "Reject Payment"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedPayment(null)
                                    setActionType(null)
                                    setNotes("")
                                  }}
                                  disabled={rejectPayment.isPending}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No payments found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

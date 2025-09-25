"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Invoice, Receipt, DashboardStats } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export function useTenantDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<DashboardStats>("/tenant/dashboard")
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export function useTenantInvoices(filters?: { status?: string; page?: number }) {
  const [data, setData] = useState<{ invoices: Invoice[]; total: number; pages: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams()
        if (filters?.status) params.append("status", filters.status)
        if (filters?.page) params.append("page", filters.page.toString())

        const response = await api.get<{ invoices: Invoice[]; total: number; pages: number }>(
          `/tenant/invoices?${params.toString()}`,
        )
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters?.status, filters?.page])

  return { data, isLoading, error }
}

export function useTenantInvoice(id: string) {
  const [data, setData] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const response = await api.get<Invoice>(`/tenant/invoices/${id}`)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { data, isLoading, error }
}

export function useTenantReceipts() {
  const [data, setData] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Receipt[]>("/tenant/receipts")
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export function useSubmitPayment() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (data: { invoiceId: string; transactionId: string; proofFile?: File }) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("invoiceId", data.invoiceId)
      formData.append("transactionId", data.transactionId)
      if (data.proofFile) {
        formData.append("proofFile", data.proofFile)
      }

      const response = await fetch("/api/v1/tenant/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit payment")
      }

      toast({
        title: "Payment submitted",
        description: "Your payment has been submitted for review",
      })

      return response.json()
    } catch (error: any) {
      toast({
        title: "Payment submission failed",
        description: error.message || "Unable to submit payment",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { mutate, isLoading }
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Property, Unit, User, Invoice, Payment, DashboardStats } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export function useLandlordDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<DashboardStats>("/landlord/dashboard")
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

export function useLandlordProperties() {
  const [data, setData] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get<Property[]>("/landlord/properties")
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useLandlordTenants() {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<User[]>("/landlord/tenants")
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

export function useLandlordPayments(status?: string) {
  const [data, setData] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = status ? `?status=${status}` : ""
      const response = await api.get<Payment[]>(`/landlord/payments${params}`)
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useLandlordInvoices() {
  const [data, setData] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get<Invoice[]>("/landlord/invoices")
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useCreateProperty() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (data: Omit<Property, "id" | "landlordId" | "units" | "createdAt" | "updatedAt">) => {
      setIsLoading(true)
      try {
        const response = await api.post<Property>("/landlord/properties", data)
        toast({
          title: "Property created",
          description: "New property has been added successfully",
        })
        return response.data
      } catch (error: any) {
        toast({
          title: "Failed to create property",
          description: error.message || "Unable to create property",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { mutate, isLoading }
}

export function useCreateUnit() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (data: Omit<Unit, "id" | "tenant" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    try {
      const response = await api.post<Unit>("/landlord/units", data)
      toast({
        title: "Unit created",
        description: "New unit has been added successfully",
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Failed to create unit",
        description: error.message || "Unable to create unit",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { mutate, isLoading }
}

export function useApprovePayment() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async ({ paymentId, notes }: { paymentId: string; notes?: string }) => {
    setIsLoading(true)
    try {
      const response = await api.post(`/landlord/payments/${paymentId}/approve`, { notes })
      toast({
        title: "Payment approved",
        description: "Payment has been approved successfully",
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Failed to approve payment",
        description: error.message || "Unable to approve payment",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { mutate, isLoading }
}

export function useRejectPayment() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async ({ paymentId, notes }: { paymentId: string; notes?: string }) => {
    setIsLoading(true)
    try {
      const response = await api.post(`/landlord/payments/${paymentId}/reject`, { notes })
      toast({
        title: "Payment rejected",
        description: "Payment has been rejected",
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Failed to reject payment",
        description: error.message || "Unable to reject payment",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { mutate, isLoading }
}

export function useGenerateInvoices() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (data: { month: string; year: string }) => {
    setIsLoading(true)
    try {
      const response = await api.post("/landlord/invoices/generate", data)
      toast({
        title: "Invoices generated",
        description: "Monthly invoices have been generated successfully",
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Failed to generate invoices",
        description: error.message || "Unable to generate invoices",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { mutate, isLoading }
}

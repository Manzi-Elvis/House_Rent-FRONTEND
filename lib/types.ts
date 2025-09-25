// Core types for BizRent Manager

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "TENANT" | "LANDLORD"
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  landlordId: string
  units: Unit[]
  createdAt: string
  updatedAt: string
}

export interface Unit {
  id: string
  propertyId: string
  unitNumber: string
  rent: number
  deposit: number
  bedrooms: number
  bathrooms: number
  squareFeet?: number
  tenantId?: string
  tenant?: User
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  tenantId: string
  unitId: string
  amount: number
  dueDate: string
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"
  description: string
  tenant?: User
  unit?: Unit
  payments?: Payment[]
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  tenantId: string
  amount: number
  transactionId: string
  proofUrl?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  submittedAt: string
  processedAt?: string
  notes?: string
  invoice?: Invoice
  tenant?: User
}

export interface Receipt {
  id: string
  paymentId: string
  invoiceId: string
  amount: number
  issuedAt: string
  downloadUrl: string
  payment?: Payment
  invoice?: Invoice
}

export interface DashboardStats {
  totalProperties?: number
  totalTenants?: number
  totalUnits?: number
  occupancyRate?: number
  monthlyRevenue?: number
  pendingPayments?: number
  overdueInvoices?: number
  recentPayments?: Payment[]
}

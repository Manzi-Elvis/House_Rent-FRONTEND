"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "TENANT" | "LANDLORD"
  phone?: string
}

interface AuthResponse {
  user: User
  token: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const router = useRouter()

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await api.get<User>("/auth/me")
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem("auth_token")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoginLoading(true)
      try {
        const response = await api.post<AuthResponse>("/auth/login", credentials)
        const { user: userData, token } = response.data

        localStorage.setItem("auth_token", token)
        setUser(userData)

        // Redirect based on role
        const redirectPath = userData.role === "LANDLORD" ? "/landlord/dashboard" : "/tenant/dashboard"
        router.push(redirectPath)

        toast({
          title: "Welcome back!",
          description: `Logged in as ${userData.firstName} ${userData.lastName}`,
        })
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        })
      } finally {
        setIsLoginLoading(false)
      }
    },
    [router],
  )

  // Register function
  const register = useCallback(
    async (data: RegisterData) => {
      setIsRegisterLoading(true)
      try {
        const response = await api.post<AuthResponse>("/auth/register", data)
        const { user: userData, token } = response.data

        localStorage.setItem("auth_token", token)
        setUser(userData)

        // Redirect based on role
        const redirectPath = userData.role === "LANDLORD" ? "/landlord/dashboard" : "/tenant/dashboard"
        router.push(redirectPath)

        toast({
          title: "Account created!",
          description: `Welcome to BizRent Manager, ${userData.firstName}!`,
        })
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message || "Unable to create account",
          variant: "destructive",
        })
      } finally {
        setIsRegisterLoading(false)
      }
    },
    [router],
  )

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }, [router])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoginLoading,
    isRegisterLoading,
  }
}

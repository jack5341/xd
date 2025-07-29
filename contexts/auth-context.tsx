"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        await getCurrentUser()
        toast({ title: "Login successful", description: "Welcome back!" })
        return true
      } else {
        toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" })
        return false
      }
    } catch (error) {
      toast({ title: "Login error", description: "Network error occurred", variant: "destructive" })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      if (response.ok) {
        toast({ title: "Registration successful", description: "Please log in with your credentials" })
        return true
      } else {
        toast({
          title: "Registration failed",
          description: "User already exists or invalid data",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({ title: "Registration error", description: "Network error occurred", variant: "destructive" })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    window.location.reload()
  }

  const getCurrentUser = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Failed to get current user:", error)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    const refresh = localStorage.getItem("refresh_token")
    if (!refresh) return false

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)
        return true
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }
    return false
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

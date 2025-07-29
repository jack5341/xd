"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token")
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <AuthProvider>{isAuthenticated ? <DashboardLayout /> : <LoginForm />}</AuthProvider>
}

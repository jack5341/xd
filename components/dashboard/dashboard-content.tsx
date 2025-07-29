"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  FileText,
  Globe,
  Network,
  RefreshCw,
  Server,
  TrendingUp,
  Users,
} from "lucide-react"
import { AnalyticsChart } from "./analytics-chart"
import { RecentActivity } from "./recent-activity"
import { SystemHealth } from "./system-health"

interface DashboardData {
  summary: {
    totalNodes: number
    totalEdges: number
    density: number
    communities: number
  }
  entities: {
    persons: number
    organizations: number
    domains: number
    ips: number
    events: number
    files: number
  }
  health: {
    status: string
    uptime: number
    alerts: number
  }
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch analytics summary
      const analyticsResponse = await fetch("http://localhost:8080/api/v1/analytics/summary", { headers })
      const analyticsData = analyticsResponse.ok ? await analyticsResponse.json() : null

      // Fetch monitoring dashboard
      const monitoringResponse = await fetch("http://localhost:8080/api/v1/monitoring/dashboard", { headers })
      const monitoringData = monitoringResponse.ok ? await monitoringResponse.json() : null

      // Fetch entity counts (simplified - in real app you'd get actual counts)
      const mockData: DashboardData = {
        summary: {
          totalNodes: analyticsData?.metrics?.nodeCount || 1250,
          totalEdges: analyticsData?.metrics?.edgeCount || 3420,
          density: analyticsData?.metrics?.density || 0.42,
          communities: analyticsData?.communities?.length || 8,
        },
        entities: {
          persons: 450,
          organizations: 120,
          domains: 280,
          ips: 340,
          events: 890,
          files: 160,
        },
        health: {
          status: monitoringData?.health?.status || "healthy",
          uptime: monitoringData?.health?.uptime || 99.8,
          alerts: monitoringData?.alerts?.length || 2,
        },
      }

      setData(mockData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* System Health */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={data?.health.status === "healthy" ? "default" : "destructive"}>
                  {data?.health.status || "Unknown"}
                </Badge>
                <span className="text-sm text-muted-foreground">{data?.health.uptime}% uptime</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary.totalNodes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{data?.summary.totalEdges.toLocaleString()} relationships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Graph Density</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(data?.summary.density || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{data?.summary.communities} communities detected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.health.alerts}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Entity Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.entities.persons.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.entities.organizations.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domains</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.entities.domains.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IP Addresses</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.entities.ips.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.entities.events.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.entities.files.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <AnalyticsChart />
          <RecentActivity />
        </div>

        <SystemHealth />
      </div>
    </div>
  )
}

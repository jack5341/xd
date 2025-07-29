"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Clock, RefreshCw, TrendingUp, XCircle } from "lucide-react"

interface MonitoringData {
  health: {
    status: string
    uptime: number
    lastCheck: string
  }
  metrics: {
    totalOperations: number
    successRate: number
    avgResponseTime: number
    errorRate: number
  }
  alerts: Array<{
    id: string
    type: string
    message: string
    severity: string
    timestamp: string
    status: string
  }>
  performance: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
}

export function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMonitoringData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch monitoring dashboard data
      const response = await fetch("http://localhost:8080/api/v1/monitoring/dashboard", { headers })

      if (response.ok) {
        const monitoringData = await response.json()
        setData(monitoringData)
      } else {
        // Use mock data for demonstration
        const mockData: MonitoringData = {
          health: {
            status: "healthy",
            uptime: 99.8,
            lastCheck: new Date().toISOString(),
          },
          metrics: {
            totalOperations: 15420,
            successRate: 98.5,
            avgResponseTime: 145,
            errorRate: 1.5,
          },
          alerts: [
            {
              id: "1",
              type: "performance",
              message: "High CPU usage detected on server-01",
              severity: "warning",
              timestamp: "2024-01-15T10:30:00Z",
              status: "active",
            },
            {
              id: "2",
              type: "security",
              message: "Multiple failed login attempts",
              severity: "high",
              timestamp: "2024-01-15T09:15:00Z",
              status: "investigating",
            },
            {
              id: "3",
              type: "database",
              message: "Slow query performance on analytics DB",
              severity: "medium",
              timestamp: "2024-01-15T08:45:00Z",
              status: "resolved",
            },
          ],
          performance: {
            cpu: 68,
            memory: 72,
            disk: 45,
            network: 23,
          },
        }
        setData(mockData)
      }
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const token = localStorage.getItem("access_token")
      await fetch("http://localhost:8080/api/v1/monitoring/alert/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ alert_id: alertId }),
      })

      fetchMonitoringData() // Refresh data
    } catch (error) {
      console.error("Failed to resolve alert:", error)
    }
  }

  useEffect(() => {
    fetchMonitoringData()
    const interval = setInterval(fetchMonitoringData, 30000) // Refresh every 30 seconds
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
        <h1 className="text-lg font-semibold">System Monitoring</h1>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={fetchMonitoringData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* System Health Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
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
              <CardTitle className="text-sm font-medium">Operations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.metrics.totalOperations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{data?.metrics.successRate}% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.metrics.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">Average response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.metrics.errorRate}%</div>
              <p className="text-xs text-muted-foreground">Error rate (last 24h)</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time system resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">{data?.performance.cpu}%</span>
                </div>
                <Progress value={data?.performance.cpu} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory</span>
                  <span className="text-sm text-muted-foreground">{data?.performance.memory}%</span>
                </div>
                <Progress value={data?.performance.memory} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Disk Usage</span>
                  <span className="text-sm text-muted-foreground">{data?.performance.disk}%</span>
                </div>
                <Progress value={data?.performance.disk} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network I/O</span>
                  <span className="text-sm text-muted-foreground">{data?.performance.network}%</span>
                </div>
                <Progress value={data?.performance.network} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>System alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {data?.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {alert.severity === "high" && <XCircle className="h-5 w-5 text-red-500" />}
                      {alert.severity === "warning" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                      {alert.severity === "medium" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {alert.status === "resolved" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        <Badge variant={alert.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.status}
                        </Badge>
                        {alert.status === "active" && (
                          <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

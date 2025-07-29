"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Database, Cpu, HardDrive, Wifi } from "lucide-react"

const healthMetrics = [
  {
    name: "Database",
    status: "healthy",
    value: 95,
    icon: Database,
    description: "Neo4j cluster operational",
  },
  {
    name: "CPU Usage",
    status: "normal",
    value: 68,
    icon: Cpu,
    description: "Processing load within limits",
  },
  {
    name: "Storage",
    status: "healthy",
    value: 42,
    icon: HardDrive,
    description: "Disk space available",
  },
  {
    name: "Network",
    status: "healthy",
    value: 88,
    icon: Wifi,
    description: "API response times optimal",
  },
]

export function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Real-time monitoring of system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {healthMetrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <Badge variant={metric.status === "healthy" ? "default" : "secondary"} className="text-xs">
                  {metric.status}
                </Badge>
              </div>
              <Progress value={metric.value} className="h-2" />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

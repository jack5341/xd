"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { EntityManagement } from "@/components/entities/entity-management"
import { GraphVisualization } from "@/components/graph/graph-visualization"
import { MonitoringDashboard } from "@/components/monitoring/monitoring-dashboard"
import { SearchInterface } from "@/components/search/search-interface"

export type NavigationItem =
  | "dashboard"
  | "persons"
  | "organizations"
  | "domains"
  | "ips"
  | "events"
  | "files"
  | "graph"
  | "monitoring"
  | "search"

export function DashboardLayout() {
  const [activeView, setActiveView] = useState<NavigationItem>("dashboard")

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardContent />
      case "persons":
        return <EntityManagement entityType="persons" />
      case "organizations":
        return <EntityManagement entityType="organizations" />
      case "domains":
        return <EntityManagement entityType="domains" />
      case "ips":
        return <EntityManagement entityType="ips" />
      case "events":
        return <EntityManagement entityType="events" />
      case "files":
        return <EntityManagement entityType="files" />
      case "graph":
        return <GraphVisualization />
      case "monitoring":
        return <MonitoringDashboard />
      case "search":
        return <SearchInterface />
      default:
        return <DashboardContent />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </SidebarProvider>
  )
}

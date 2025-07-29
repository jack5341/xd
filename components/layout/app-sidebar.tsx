"use client"

import {
  Building2,
  Database,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Monitor,
  Network,
  Search,
  Server,
  Shield,
  Users,
  Calendar,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import type { NavigationItem } from "./dashboard-layout"

interface AppSidebarProps {
  activeView: NavigationItem
  onNavigate: (view: NavigationItem) => void
}

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, key: "dashboard" as NavigationItem },
      { title: "Search", icon: Search, key: "search" as NavigationItem },
      { title: "Graph View", icon: Network, key: "graph" as NavigationItem },
    ],
  },
  {
    title: "Entity Management",
    items: [
      { title: "People", icon: Users, key: "persons" as NavigationItem },
      { title: "Organizations", icon: Building2, key: "organizations" as NavigationItem },
      { title: "Domains", icon: Globe, key: "domains" as NavigationItem },
      { title: "IP Addresses", icon: Server, key: "ips" as NavigationItem },
      { title: "Events", icon: Calendar, key: "events" as NavigationItem },
      { title: "Files", icon: FileText, key: "files" as NavigationItem },
    ],
  },
  {
    title: "System",
    items: [{ title: "Monitoring", icon: Monitor, key: "monitoring" as NavigationItem }],
  },
]

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">ERM System</span>
            <span className="text-xs text-muted-foreground">Enterprise Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton isActive={activeView === item.key} onClick={() => onNavigate(item.key)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <User className="h-4 w-4" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

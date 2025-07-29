"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, FileText, Plus, Trash2, Users } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "create",
    entity: "Person",
    description: "John Doe added to system",
    timestamp: "2 minutes ago",
    icon: Plus,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "update",
    entity: "Organization",
    description: "Acme Corp information updated",
    timestamp: "5 minutes ago",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "delete",
    entity: "Domain",
    description: "old-domain.com removed",
    timestamp: "10 minutes ago",
    icon: Trash2,
    color: "text-red-500",
  },
  {
    id: 4,
    type: "create",
    entity: "Event",
    description: "Security incident logged",
    timestamp: "15 minutes ago",
    icon: Calendar,
    color: "text-orange-500",
  },
  {
    id: 5,
    type: "create",
    entity: "Relationship",
    description: "New connection established",
    timestamp: "20 minutes ago",
    icon: Users,
    color: "text-purple-500",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest changes and updates in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <activity.icon className="h-3 w-3" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.entity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

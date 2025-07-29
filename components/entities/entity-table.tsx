"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface EntityTableProps {
  entityType: string
  entities: any[]
  isLoading: boolean
  onEdit: (entity: any) => void
  onDelete: (id: string) => void
}

export function EntityTable({ entityType, entities, isLoading, onEdit, onDelete }: EntityTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const renderTableHeaders = () => {
    switch (entityType) {
      case "persons":
        return (
          <>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </>
        )
      case "organizations":
        return (
          <>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Actions</TableHead>
          </>
        )
      case "domains":
        return (
          <>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registrar</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </>
        )
      case "ips":
        return (
          <>
            <TableHead>IP Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>ISP</TableHead>
            <TableHead>Actions</TableHead>
          </>
        )
      case "events":
        return (
          <>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </>
        )
      case "files":
        return (
          <>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Actions</TableHead>
          </>
        )
      default:
        return <TableHead>Data</TableHead>
    }
  }

  const renderTableRow = (entity: any, index: number) => {
    const mockData = generateMockData(entityType, index)

    switch (entityType) {
      case "persons":
        return (
          <>
            <TableCell className="font-medium">{mockData.name}</TableCell>
            <TableCell>{mockData.email}</TableCell>
            <TableCell>{mockData.phone}</TableCell>
            <TableCell>
              <Badge variant="outline">{mockData.status}</Badge>
            </TableCell>
          </>
        )
      case "organizations":
        return (
          <>
            <TableCell className="font-medium">{mockData.name}</TableCell>
            <TableCell>{mockData.industry}</TableCell>
            <TableCell>{mockData.size}</TableCell>
            <TableCell>{mockData.website}</TableCell>
          </>
        )
      case "domains":
        return (
          <>
            <TableCell className="font-medium">{mockData.domain}</TableCell>
            <TableCell>
              <Badge variant={mockData.status === "Active" ? "default" : "secondary"}>{mockData.status}</Badge>
            </TableCell>
            <TableCell>{mockData.registrar}</TableCell>
            <TableCell>{mockData.expires}</TableCell>
          </>
        )
      case "ips":
        return (
          <>
            <TableCell className="font-medium">{mockData.ip}</TableCell>
            <TableCell>{mockData.type}</TableCell>
            <TableCell>{mockData.location}</TableCell>
            <TableCell>{mockData.isp}</TableCell>
          </>
        )
      case "events":
        return (
          <>
            <TableCell className="font-medium">{mockData.title}</TableCell>
            <TableCell>{mockData.type}</TableCell>
            <TableCell>{mockData.date}</TableCell>
            <TableCell>
              <Badge variant={mockData.status === "Resolved" ? "default" : "destructive"}>{mockData.status}</Badge>
            </TableCell>
          </>
        )
      case "files":
        return (
          <>
            <TableCell className="font-medium">{mockData.name}</TableCell>
            <TableCell>{mockData.type}</TableCell>
            <TableCell>{mockData.size}</TableCell>
            <TableCell>{mockData.modified}</TableCell>
          </>
        )
      default:
        return <TableCell>{JSON.stringify(entity)}</TableCell>
    }
  }

  // Generate mock data for demonstration
  const generateMockData = (type: string, index: number) => {
    const mockDataSets = {
      persons: [
        { name: "John Doe", email: "john@example.com", phone: "+1-555-0123", status: "Active" },
        { name: "Jane Smith", email: "jane@example.com", phone: "+1-555-0124", status: "Inactive" },
        { name: "Bob Johnson", email: "bob@example.com", phone: "+1-555-0125", status: "Active" },
      ],
      organizations: [
        { name: "Acme Corp", industry: "Technology", size: "Large", website: "acme.com" },
        { name: "Tech Solutions", industry: "Software", size: "Medium", website: "techsol.com" },
        { name: "Global Industries", industry: "Manufacturing", size: "Large", website: "global.com" },
      ],
      domains: [
        { domain: "example.com", status: "Active", registrar: "GoDaddy", expires: "2024-12-31" },
        { domain: "test.org", status: "Expired", registrar: "Namecheap", expires: "2024-01-15" },
        { domain: "demo.net", status: "Active", registrar: "CloudFlare", expires: "2025-06-30" },
      ],
      ips: [
        { ip: "192.168.1.1", type: "IPv4", location: "US", isp: "Comcast" },
        { ip: "10.0.0.1", type: "IPv4", location: "US", isp: "Verizon" },
        { ip: "2001:db8::1", type: "IPv6", location: "CA", isp: "Bell Canada" },
      ],
      events: [
        { title: "Security Alert", type: "Security", date: "2024-01-15", status: "Open" },
        { title: "System Update", type: "Maintenance", date: "2024-01-14", status: "Resolved" },
        { title: "Data Breach", type: "Security", date: "2024-01-13", status: "Investigating" },
      ],
      files: [
        { name: "report.pdf", type: "PDF", size: "2.4 MB", modified: "2024-01-15" },
        { name: "data.csv", type: "CSV", size: "1.2 MB", modified: "2024-01-14" },
        { name: "image.png", type: "PNG", size: "856 KB", modified: "2024-01-13" },
      ],
    }

    return mockDataSets[type as keyof typeof mockDataSets]?.[index % 3] || {}
  }

  // Use mock data if no real entities
  const displayEntities = entities.length > 0 ? entities : Array.from({ length: 10 }, (_, i) => ({ id: i }))

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>{renderTableHeaders()}</TableRow>
        </TableHeader>
        <TableBody>
          {displayEntities.map((entity, index) => (
            <TableRow key={entity.id || index}>
              {renderTableRow(entity, index)}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(entity)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(entity.id || index.toString())}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Search } from "lucide-react"
import { EntityTable } from "./entity-table"
import { EntityDialog } from "./entity-dialog"

interface EntityManagementProps {
  entityType: "persons" | "organizations" | "domains" | "ips" | "events" | "files"
}

export function EntityManagement({ entityType }: EntityManagementProps) {
  const [entities, setEntities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  const entityLabels = {
    persons: "People",
    organizations: "Organizations",
    domains: "Domains",
    ips: "IP Addresses",
    events: "Events",
    files: "Files",
  }

  const fetchEntities = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://localhost:8080/api/v1/${entityType}?search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setEntities(data.items || data || [])
      }
    } catch (error) {
      console.error(`Failed to fetch ${entityType}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntities()
  }, [entityType, searchTerm])

  const handleCreate = () => {
    setSelectedEntity(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (entity: any) => {
    setSelectedEntity(entity)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://localhost:8080/api/v1/${entityType}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchEntities()
      }
    } catch (error) {
      console.error(`Failed to delete ${entityType}:`, error)
    }
  }

  const handleSave = () => {
    setIsDialogOpen(false)
    fetchEntities()
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">{entityLabels[entityType]}</h1>
      </header>

      <div className="flex-1 space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${entityLabels[entityType].toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add {entityLabels[entityType].slice(0, -1)}
          </Button>
        </div>

        <EntityTable
          entityType={entityType}
          entities={entities}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EntityDialog
          entityType={entityType}
          entity={selectedEntity}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

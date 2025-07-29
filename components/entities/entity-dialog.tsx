"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EntityDialogProps {
  entityType: string
  entity: any
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function EntityDialog({ entityType, entity, isOpen, onClose, onSave }: EntityDialogProps) {
  const [formData, setFormData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (entity) {
      setFormData(entity)
    } else {
      setFormData({})
    }
  }, [entity])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const method = entity ? "PUT" : "POST"
      const url = entity
        ? `http://localhost:8080/api/v1/${entityType}/${entity.id}`
        : `http://localhost:8080/api/v1/${entityType}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
      }
    } catch (error) {
      console.error("Failed to save entity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderFormFields = () => {
    switch (entityType) {
      case "persons":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </>
        )
      case "organizations":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry || ""}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select
                  value={formData.size || ""}
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-50)</SelectItem>
                    <SelectItem value="medium">Medium (51-200)</SelectItem>
                    <SelectItem value="large">Large (201+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </>
        )
      case "domains":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                value={formData.domain || ""}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrar">Registrar</Label>
              <Input
                id="registrar"
                value={formData.registrar || ""}
                onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate || ""}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>
          </>
        )
      case "ips":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress || ""}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ipv4">IPv4</SelectItem>
                    <SelectItem value="ipv6">IPv6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isp">ISP</Label>
              <Input
                id="isp"
                value={formData.isp || ""}
                onChange={(e) => setFormData({ ...formData, isp: e.target.value })}
              />
            </div>
          </>
        )
      case "events":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </>
        )
      case "files":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">File Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">File Type</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="img">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size || ""}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </>
        )
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Textarea
              id="data"
              value={JSON.stringify(formData, null, 2)}
              onChange={(e) => {
                try {
                  setFormData(JSON.parse(e.target.value))
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
            />
          </div>
        )
    }
  }

  const getDialogTitle = () => {
    const entityLabels = {
      persons: "Person",
      organizations: "Organization",
      domains: "Domain",
      ips: "IP Address",
      events: "Event",
      files: "File",
    }

    const label = entityLabels[entityType as keyof typeof entityLabels] || "Entity"
    return entity ? `Edit ${label}` : `Create ${label}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {entity ? "Update the information below." : "Fill in the details to create a new entry."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{renderFormFields()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

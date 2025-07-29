"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Building2, Users, Globe, Server, Calendar, FileText } from "lucide-react"

interface SearchResult {
  id: string
  type: string
  title: string
  description: string
  properties: Record<string, any>
  relevance: number
}

export function SearchInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const performSearch = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const endpoint =
        activeTab === "all"
          ? `http://localhost:8080/api/v1/search?q=${encodeURIComponent(searchTerm)}`
          : `http://localhost:8080/api/v1/search/${activeTab}?q=${encodeURIComponent(searchTerm)}`

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      } else {
        // Use mock data for demonstration
        const mockResults = generateMockResults(searchTerm, activeTab)
        setResults(mockResults)
      }
    } catch (error) {
      console.error("Search failed:", error)
      // Use mock data as fallback
      const mockResults = generateMockResults(searchTerm, activeTab)
      setResults(mockResults)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResults = (query: string, type: string): SearchResult[] => {
    const mockData = [
      {
        id: "1",
        type: "Person",
        title: "John Doe",
        description: "Software Engineer at Acme Corp",
        properties: { email: "john@example.com", phone: "+1-555-0123" },
        relevance: 0.95,
      },
      {
        id: "2",
        type: "Organization",
        title: "Acme Corporation",
        description: "Technology company specializing in software solutions",
        properties: { industry: "Technology", size: "Large", website: "acme.com" },
        relevance: 0.88,
      },
      {
        id: "3",
        type: "Domain",
        title: "example.com",
        description: "Primary domain for Example Organization",
        properties: { registrar: "GoDaddy", expires: "2024-12-31" },
        relevance: 0.82,
      },
      {
        id: "4",
        type: "IP",
        title: "192.168.1.1",
        description: "Internal network gateway",
        properties: { type: "IPv4", location: "US", isp: "Comcast" },
        relevance: 0.75,
      },
      {
        id: "5",
        type: "Event",
        title: "Security Incident #2024-001",
        description: "Unauthorized access attempt detected",
        properties: { severity: "High", status: "Investigating", date: "2024-01-15" },
        relevance: 0.7,
      },
      {
        id: "6",
        type: "File",
        title: "security-report.pdf",
        description: "Monthly security assessment report",
        properties: { size: "2.4 MB", type: "PDF", modified: "2024-01-15" },
        relevance: 0.65,
      },
    ]

    return mockData
      .filter((item) => type === "all" || item.type.toLowerCase() === type)
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Person":
        return <Users className="h-4 w-4" />
      case "Organization":
        return <Building2 className="h-4 w-4" />
      case "Domain":
        return <Globe className="h-4 w-4" />
      case "IP":
        return <Server className="h-4 w-4" />
      case "Event":
        return <Calendar className="h-4 w-4" />
      case "File":
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return "text-green-500"
    if (relevance >= 0.6) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Global Search</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search Input */}
        <Card>
          <CardHeader>
            <CardTitle>Search Entities</CardTitle>
            <CardDescription>Search across all entities and their relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && performSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={performSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="persons">People</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="ips">IPs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Search Results */}
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    Found {results.length} results for "{searchTerm}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="flex-shrink-0 p-2 bg-muted rounded-md">{getTypeIcon(result.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{result.title}</h3>
                            <Badge variant="outline">{result.type}</Badge>
                            <span className={`text-xs font-medium ${getRelevanceColor(result.relevance)}`}>
                              {(result.relevance * 100).toFixed(0)}% match
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.properties)
                              .slice(0, 3)
                              .map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {String(value)}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {searchTerm && results.length === 0 && !isLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground text-center">Try adjusting your search terms or filters</p>
                </CardContent>
              </Card>
            )}

            {/* Search Tips */}
            {!searchTerm && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Tips</CardTitle>
                  <CardDescription>Get the most out of your searches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Entity Types</h4>
                      <p className="text-sm text-muted-foreground">
                        Search across People, Organizations, Domains, IP Addresses, Events, and Files
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Search Operators</h4>
                      <p className="text-sm text-muted-foreground">Use quotes for exact matches: "John Doe"</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Use the tabs above to filter results by entity type
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

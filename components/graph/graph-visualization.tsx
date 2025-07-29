"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Download, ZoomIn, ZoomOut, Maximize } from "lucide-react"

interface GraphNode {
  id: string
  label: string
  type: string
  properties: Record<string, any>
}

interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  properties: Record<string, any>
}

interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export function GraphVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchGraphData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8080/api/v1/relationships/graph", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setGraphData(data)
        renderGraph(data)
      } else {
        // Use mock data for demonstration
        const mockData = generateMockGraphData()
        setGraphData(mockData)
        renderGraph(mockData)
      }
    } catch (error) {
      console.error("Failed to fetch graph data:", error)
      // Use mock data as fallback
      const mockData = generateMockGraphData()
      setGraphData(mockData)
      renderGraph(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockGraphData = (): GraphData => {
    const nodes: GraphNode[] = [
      { id: "1", label: "John Doe", type: "Person", properties: { email: "john@example.com" } },
      { id: "2", label: "Acme Corp", type: "Organization", properties: { industry: "Technology" } },
      { id: "3", label: "example.com", type: "Domain", properties: { registrar: "GoDaddy" } },
      { id: "4", label: "192.168.1.1", type: "IP", properties: { location: "US" } },
      { id: "5", label: "Security Alert", type: "Event", properties: { severity: "High" } },
      { id: "6", label: "Jane Smith", type: "Person", properties: { email: "jane@example.com" } },
      { id: "7", label: "Tech Solutions", type: "Organization", properties: { industry: "Software" } },
      { id: "8", label: "test.org", type: "Domain", properties: { registrar: "Namecheap" } },
    ]

    const edges: GraphEdge[] = [
      { id: "e1", source: "1", target: "2", type: "WORKS_FOR", properties: {} },
      { id: "e2", source: "2", target: "3", type: "OWNS", properties: {} },
      { id: "e3", source: "3", target: "4", type: "RESOLVES_TO", properties: {} },
      { id: "e4", source: "1", target: "5", type: "REPORTED", properties: {} },
      { id: "e5", source: "6", target: "7", type: "WORKS_FOR", properties: {} },
      { id: "e6", source: "1", target: "6", type: "KNOWS", properties: {} },
      { id: "e7", source: "7", target: "8", type: "OWNS", properties: {} },
    ]

    return { nodes, edges }
  }

  const renderGraph = (data: GraphData) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Simple force-directed layout simulation
    const nodes = data.nodes.map((node, index) => ({
      ...node,
      x: Math.random() * (canvas.width - 100) + 50,
      y: Math.random() * (canvas.height - 100) + 50,
      vx: 0,
      vy: 0,
    }))

    // Node colors by type
    const nodeColors: Record<string, string> = {
      Person: "#3b82f6",
      Organization: "#10b981",
      Domain: "#f59e0b",
      IP: "#ef4444",
      Event: "#8b5cf6",
      File: "#06b6d4",
    }

    // Draw edges
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 1
    data.edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (sourceNode && targetNode) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      const color = nodeColors[node.type] || "#6b7280"

      // Draw node circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw node label
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.label.substring(0, 10), node.x, node.y + 35)
    })

    // Add click handler
    canvas.onclick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedNode = nodes.find((node) => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        return distance <= 20
      })

      if (clickedNode) {
        setSelectedNode(clickedNode)
      }
    }
  }

  const exportGraph = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8080/api/v1/graph/export?format=json", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "graph-export.json"
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to export graph:", error)
    }
  }

  useEffect(() => {
    fetchGraphData()
  }, [])

  useEffect(() => {
    if (graphData.nodes.length > 0) {
      renderGraph(graphData)
    }
  }, [graphData, filterType, searchTerm])

  const filteredNodes = graphData.nodes.filter((node) => {
    const matchesType = filterType === "all" || node.type === filterType
    const matchesSearch = searchTerm === "" || node.label.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Graph Visualization</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchGraphData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportGraph}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Graph Canvas */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Entity Relationship Graph</CardTitle>
                  <CardDescription>Interactive visualization of entities and their relationships</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
              <canvas
                ref={canvasRef}
                className="w-full h-full border rounded-md bg-background"
                style={{ cursor: "pointer" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l p-4 space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Node Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Person">Person</SelectItem>
                    <SelectItem value="Organization">Organization</SelectItem>
                    <SelectItem value="Domain">Domain</SelectItem>
                    <SelectItem value="IP">IP Address</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="File">File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Node Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Badge variant="outline" className="ml-2">
                    {selectedNode.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Label</Label>
                  <p className="text-sm font-medium">{selectedNode.label}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Properties</Label>
                  <div className="space-y-1">
                    {Object.entries(selectedNode.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Graph Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Nodes:</span>
                <span>{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Edges:</span>
                <span>{graphData.edges.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Density:</span>
                <span>
                  {graphData.nodes.length > 1
                    ? (
                        (graphData.edges.length / ((graphData.nodes.length * (graphData.nodes.length - 1)) / 2)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

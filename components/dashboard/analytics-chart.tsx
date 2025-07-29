"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", nodes: 400, edges: 800 },
  { name: "Feb", nodes: 450, edges: 920 },
  { name: "Mar", nodes: 520, edges: 1100 },
  { name: "Apr", nodes: 580, edges: 1250 },
  { name: "May", nodes: 650, edges: 1400 },
  { name: "Jun", nodes: 720, edges: 1580 },
]

const chartConfig = {
  nodes: {
    label: "Nodes",
    color: "hsl(var(--chart-1))",
  },
  edges: {
    label: "Edges",
    color: "hsl(var(--chart-2))",
  },
}

export function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Graph Growth</CardTitle>
        <CardDescription>Node and edge count over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="nodes"
                stackId="1"
                stroke={chartConfig.nodes.color}
                fill={chartConfig.nodes.color}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="edges"
                stackId="1"
                stroke={chartConfig.edges.color}
                fill={chartConfig.edges.color}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

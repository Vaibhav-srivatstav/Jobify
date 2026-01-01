"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Target, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    averageATS: 0,
    totalApplications: 0,
    activeJobs: 0,
    successRate: 0,
  })

  useEffect(() => {
    // Load mock stats
    const mockStats = {
      averageATS: 78,
      totalApplications: 12,
      activeJobs: 24,
      successRate: 85,
    }
    setStats(mockStats)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average ATS Score</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.averageATS}%</div>
          <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          <FileText className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground mt-1">3 pending review</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Job Matches</CardTitle>
          <Target className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.activeJobs}</div>
          <p className="text-xs text-muted-foreground mt-1">Based on your profile</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Match Success Rate</CardTitle>
          <CheckCircle2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Above average</p>
        </CardContent>
      </Card>
    </div>
  )
}

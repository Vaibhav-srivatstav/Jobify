"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Target, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react"
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
      
      {/* Card 1: ATS Score */}
      <Card className="border-border/50 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-transparent opacity-20" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average ATS Score</CardTitle>
          <div className="size-8 rounded-md bg-blue-500/10 flex items-center justify-center">
             <TrendingUp className="size-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageATS}%</div>
          <p className="text-xs text-emerald-500 flex items-center mt-1">
            <ArrowUpRight className="size-3 mr-1" /> +5% from last week
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Total Apps */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          <div className="size-8 rounded-md bg-purple-500/10 flex items-center justify-center">
            <FileText className="size-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground mt-1">3 pending review</p>
        </CardContent>
      </Card>

      {/* Card 3: Active Jobs */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Job Matches</CardTitle>
          <div className="size-8 rounded-md bg-amber-500/10 flex items-center justify-center">
            <Target className="size-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeJobs}</div>
          <p className="text-xs text-muted-foreground mt-1">Based on your profile</p>
        </CardContent>
      </Card>

      {/* Card 4: Success Rate */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Match Success</CardTitle>
          <div className="size-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-emerald-500 flex items-center mt-1">
             <ArrowUpRight className="size-3 mr-1" /> Top 10% of users
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
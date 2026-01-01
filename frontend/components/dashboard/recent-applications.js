"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function RecentApplications() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const mockApps = [
      {
        id: "1",
        company: "TechCorp Inc.",
        role: "Senior Software Engineer",
        status: "SUBMITTED",
        atsScore: 85,
        matchScore: 92,
        appliedAt: "2 days ago",
      },
      {
        id: "2",
        company: "Innovation Labs",
        role: "Full Stack Developer",
        status: "READY",
        atsScore: 78,
        matchScore: 88,
        appliedAt: "3 days ago",
      },
      {
        id: "3",
        company: "Digital Solutions",
        role: "Frontend Engineer",
        status: "SUBMITTED",
        atsScore: 92,
        matchScore: 95,
        appliedAt: "5 days ago",
      },
    ]
    setApplications(mockApps)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "READY":
        return "bg-white text-black border border-gray-300 dark:bg-black dark:text-white dark:border-transparent"
      case "SUBMITTED":
        return "bg-gray-100 text-black border border-gray-300 dark:bg-black dark:text-white dark:border-transparent"
      case "FAILED":
        return "bg-white text-red-600 border border-gray-300 dark:bg-black dark:text-red-500 dark:border-transparent"
      default:
        return ""
    }
  }

  return (
    <Card className="border border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-400">
            Your latest job applications
          </CardDescription>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hover:border dark:hover:border/50 hover:border-gray-400 hover:bg-gray-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
        >
          <Link href="/applications">
            View all
            <ArrowRight className="size-4 ml-2" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 rounded-lg border dark:border dark:border/50 dark:border-transparent hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-white dark:bg-black flex items-center justify-center border border-gray-200 dark:border-zinc-700">
                  <Building2 className="size-6 text-black dark:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white">
                    {app.role}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {app.company}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {app.appliedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-black dark:text-white">
                    ATS: {app.atsScore}%
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Match: {app.matchScore}%
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(app.status)}
                >
                  {app.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

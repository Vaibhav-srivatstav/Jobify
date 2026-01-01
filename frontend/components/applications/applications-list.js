"use client"

import { ApplicationCard } from "@/components/applications/application-card"
import { Card, CardContent } from "@/components/ui/card"
import { Inbox } from "lucide-react"
import { useEffect, useState } from "react"

export function ApplicationsList() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("applications")
    if (stored) {
      // Deduplicate just in case
      const apps = JSON.parse(stored)
      const uniqueApps = Array.from(
        new Map(apps.map((a) => [a.id, a])).values()
      )
      setApplications(uniqueApps)
      localStorage.setItem("applications", JSON.stringify(uniqueApps))
    } else {
      // Initial mock applications
      const mockApps = [
        {
          id: "1",
          company: "TechVision Corp",
          role: "Senior Full Stack Developer",
          location: "San Francisco, CA",
          salary: "$150k - $200k",
          status: "SUBMITTED",
          atsScore: 88,
          matchScore: 92,
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          company: "Innovation Labs",
          role: "Frontend Engineer",
          location: "Remote",
          salary: "$120k - $160k",
          status: "READY",
          atsScore: 90,
          matchScore: 85,
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          company: "DataScale Inc",
          role: "Software Engineering Lead",
          location: "New York, NY",
          salary: "$180k - $230k",
          status: "SUBMITTED",
          atsScore: 82,
          matchScore: 78,
          appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          company: "CloudFirst Solutions",
          role: "DevOps Engineer",
          location: "Austin, TX",
          salary: "$130k - $170k",
          status: "READY",
          atsScore: 85,
          matchScore: 72,
          appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "5",
          company: "StartupXYZ",
          role: "Full Stack Engineer",
          location: "Los Angeles, CA",
          salary: "$110k - $150k",
          status: "SUBMITTED",
          atsScore: 91,
          matchScore: 88,
          appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "6",
          company: "FinTech Solutions",
          role: "Backend Developer",
          location: "Chicago, IL",
          salary: "$140k - $180k",
          status: "FAILED",
          atsScore: 65,
          matchScore: 58,
          appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setApplications(mockApps)
      localStorage.setItem("applications", JSON.stringify(mockApps))
    }
  }, [])

  if (applications.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center mb-4">
            <Inbox className="size-8 text-black dark:text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            No applications yet
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 text-center">
            Start reviewing jobs to build your application list
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  )
}

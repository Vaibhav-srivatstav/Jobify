"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export function ApplicationCard({ application }) {
  const getStatusClasses = (status) => {
    // Professional black/white theme for badge
    return "bg-zinc-50 text-black dark:bg-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="border-border/50 hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1">
            <div className="size-12 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 flex items-center justify-center shrink-0">
              <Building2 className="size-6 text-black dark:text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold leading-tight truncate text-black dark:text-white">
                {application.role}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate">
                {application.company}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={getStatusClasses(application.status)}
          >
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 shrink-0" />
            <span className="truncate">{application.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" />
            <span>Applied {formatDate(application.appliedAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300">
          <span>Match: {application.matchScore}%</span>
          <span>ATS: {application.atsScore}%</span>
        </div>

        <Button
          asChild
          className="w-full border border-zinc-300 dark:border-zinc-700 text-black dark:text-white bg-white dark:bg-black hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-colors"
          size="sm"
        >
          <Link
            href={`/apply/${application.id}`}
            className="flex items-center justify-center gap-2"
          >
            View Details
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

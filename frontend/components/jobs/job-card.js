"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Target,
  TrendingUp,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function JobCard({ job, swipeDirection }) {
  const getScoreColor = (score) => {
    if (score >= 80)
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"

    if (score >= 60)
      return "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"

    return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
  }

  return (
    <Card
      className={cn(
        "relative border-border/50 shadow-md transition-all duration-300 hover:shadow-lg",
        swipeDirection === "left" && "translate-x-[-100%] opacity-0",
        swipeDirection === "right" && "translate-x-[100%] opacity-0"
      )}
    >
      {swipeDirection && (
        <div
          className={cn(
            "absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded",
            swipeDirection === "right"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {swipeDirection === "right" ? "APPLY" : "SKIP"}
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold truncate">
              {job.role}
            </CardTitle>

            <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground truncate">
              <Building2 className="size-4" /> {job.company}
            </CardDescription>

            <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground truncate">
              <Globe className="size-4" /> {job.source}
            </CardDescription>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <Badge variant="outline" className={getScoreColor(job.matchScore)}>
              <Target className="size-3 mr-1" />
              {job.matchScore}%
            </Badge>

            <Badge variant="outline" className={getScoreColor(job.atsScore)}>
              <TrendingUp className="size-3 mr-1" />
              {job.atsScore}%
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="size-4" /> {job.location}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="size-4" /> {job.salary}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="size-4" /> {job.type}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4">
        <div>
          <h4 className="font-semibold mb-2 text-black dark:text-white">
            About the Role
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {job.description}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-black dark:text-white">
            Requirements
          </h4>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-hidden">
            {job.requirements.map((req, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-black dark:text-white border border-zinc-200 dark:border-zinc-800"
              >
                {req}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Match Score:</span>
              <span className="font-medium">
                {job.matchScore}% – Great fit for your profile
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ATS Score:</span>
              <span className="font-medium">
                {job.atsScore}% – Likely to pass screening
              </span>
            </div>
          </div>
        </div>

        {job.url && (
          <Link
            href={job.url}
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            View job posting →
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

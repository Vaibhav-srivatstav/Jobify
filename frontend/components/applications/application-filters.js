"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function ApplicationFilters() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { label: "All", value: "all", count: 12 },
    { label: "Ready", value: "READY", count: 3 },
    { label: "Submitted", value: "SUBMITTED", count: 8 },
    { label: "Failed", value: "FAILED", count: 1 },
  ]

  const getButtonClasses = (value) => {
    return activeFilter === value
      ? "gap-2 bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800"
      : "gap-2 bg-transparent text-black dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/80"
  }

  const getBadgeClasses = () =>
    "ml-1 px-2 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white border border-zinc-300 dark:border-zinc-700"

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          size="sm"
          onClick={() => setActiveFilter(filter.value)}
          className={getButtonClasses(filter.value)}
        >
          {filter.label}
          <Badge className={getBadgeClasses()}>{filter.count}</Badge>
        </Button>
      ))}
    </div>
  )
}

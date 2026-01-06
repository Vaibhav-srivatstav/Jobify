"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ApplicationFilters({ applications = [] }) {
  const counts = {
      all: applications.length,
      APPLIED: applications.filter(a => a.status === "APPLIED").length,
      INTERVIEW: applications.filter(a => a.status === "INTERVIEW").length,
      OFFER: applications.filter(a => a.status === "OFFER").length,
      REJECTED: applications.filter(a => a.status === "REJECTED").length
  }

  const filters = [
    { label: "Total", value: "all", count: counts.all },
    { label: "Applied", value: "APPLIED", count: counts.APPLIED },
    { label: "Interview", value: "INTERVIEW", count: counts.INTERVIEW },
    { label: "Offers", value: "OFFER", count: counts.OFFER },
    { label: "Rejected", value: "REJECTED", count: counts.REJECTED },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 pointer-events-none opacity-80"> 
      {filters.map((filter) => (
        <Button key={filter.value} size="sm" variant="outline" className="gap-2 h-8 text-xs">
          {filter.label}
          <Badge variant="secondary" className="px-1.5 h-5 text-[10px]">{filter.count}</Badge>
        </Button>
      ))}
    </div>
  )
}
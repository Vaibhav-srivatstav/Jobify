"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Search, Upload, BarChart3, Briefcase, ArrowRight } from "lucide-react"

export function QuickActions() {
  
  const actions = [
    {
      label: "Find Jobs",
      href: "/jobs",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "Search LinkedIn"
    },
    {
      label: "Upload Resume",
      href: "/resume",
      icon: Upload,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "Parse & Update"
    },
    {
      label: "Match Analysis",
      href: "/analyze",
      icon: BarChart3,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: "Check fit"
    },
    {
      label: "Applications",
      href: "/applications",
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      desc: "Track status"
    }
  ]

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Shortcuts to key tools</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            href={action.href}
            className="group flex flex-col justify-between p-4 rounded-xl border border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-border transition-all duration-200"
          >
            <div className={`size-8  rounded-lg ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className={`size-4 ${action.color}`} />
            </div>
            
            <div>
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {action.label}
              </h4>
              <p className="text-[10px] text-muted-foreground">
                {action.desc}
              </p>
            </div>
            
            {/* Subtle decorative arrow on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowRight className="size-3 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
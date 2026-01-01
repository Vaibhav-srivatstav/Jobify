import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Search, Upload, BarChart3, Briefcase } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with your job search</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2  lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto hover:bg-zinc-200 dark:hover:text-white hover:text-black flex-col gap-2 py-4">
            <Link href="/jobs">
              <Search className="size-6" />
              <span className="font-medium">Find Jobs</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto hover:bg-zinc-200 dark:hover:text-white hover:text-black flex-col gap-2 py-4 ">
            <Link href="/resume">
              <Upload className="size-6" />
              <span className="font-medium">Upload Resume</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto hover:bg-zinc-200 dark:hover:text-white hover:text-black flex-col gap-2 py-4 ">
            <Link href="/analyze">
              <BarChart3 className="size-6" />
              <span className="font-medium">Analyze Match</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto hover:bg-zinc-200 dark:hover:text-white hover:text-black flex-col gap-2 py-4">
            <Link href="/applications">
              <Briefcase className="size-6" />
              <span className="font-medium">My Applications</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

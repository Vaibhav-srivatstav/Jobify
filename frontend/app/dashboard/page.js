import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-lg">Welcome back! Here's your application overview</p>
          </div>

          <DashboardStats />
          <QuickActions />
          <RecentApplications />
        </div>
      </main>
    </div>
  )
}

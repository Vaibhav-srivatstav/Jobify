import { ApplicationsList } from "@/components/applications/applications-list"
import { ApplicationFilters } from "@/components/applications/application-filters"

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground text-lg">Track and manage your job applications</p>
          </div>

          <ApplicationFilters />
          <ApplicationsList />
        </div>
      </main>
    </div>
  )
}

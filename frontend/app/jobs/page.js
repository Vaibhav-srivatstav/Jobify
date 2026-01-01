import { JobSwiper } from "@/components/jobs/job-swiper"

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Discover Jobs</h1>
            <p className="text-muted-foreground text-lg">Swipe right to apply, left to skip</p>
          </div>

          <JobSwiper />
        </div>
      </main>
    </div>
  )
}

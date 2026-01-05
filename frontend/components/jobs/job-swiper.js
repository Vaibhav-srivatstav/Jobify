"use client"

import { JobCard } from "@/components/jobs/job-card"
import { Button } from "@/components/ui/button"
import { X, ExternalLink, CheckCheck, RotateCcw, DownloadCloud, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function JobSwiper({ jobs = [], onLoadMore, isLoadingMore }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(null)

  // Reset index ONLY if the jobs array was completely replaced (length went from >0 to different >0 but index out of bounds, or reset to 0)
  // However, for "Load More", we want to KEEP the current index.
  // We only reset if we did a fresh search (jobs changed drastically and index is 0)
  useEffect(() => {
    // If we have jobs but index is way out, reset. 
    // Usually standard search resets 'jobs' to empty first, handling this.
  }, [jobs])

  if (!jobs || jobs.length === 0) {
    return (
        <div className="text-center py-10 text-muted-foreground">
            No jobs found. Try adjusting your search.
        </div>
    )
  }

  const currentJob = jobs[currentIndex]

  const handleSwipe = (direction) => {
    setSwipeDirection(direction)

    setTimeout(() => {
      if (direction === "right") {
        if (currentJob.source === "LinkedIn" || currentJob._id.toString().startsWith("ext_") || currentJob._id.toString().startsWith("linkedin_")) {
            if(currentJob.applyUrl) window.open(currentJob.applyUrl, '_blank');
        } else {
            // Local Application Logic
            const applications = JSON.parse(localStorage.getItem("applications") || "[]")
            if (!applications.some(app => app._id === currentJob._id)) {
                applications.push({
                    ...currentJob,
                    status: "READY",
                    appliedAt: new Date().toISOString(),
                })
                localStorage.setItem("applications", JSON.stringify(applications))
            }
            router.push(`/apply/${currentJob._id}`)
        }
      }

      // Move to next card
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
    }, 300)
  }

  const handleSkip = () => handleSwipe("left")
  const handleApply = () => handleSwipe("right")

  const handleReset = () => {
    setCurrentIndex(0)
    setSwipeDirection(null)
  }

  // --- END OF STACK VIEW ---
  if (currentIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in-95 duration-500">
        <div className="size-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6 shadow-inner">
          <DownloadCloud className="size-10 text-black dark:text-white" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">You've viewed all jobs!</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-xs">
            We can fetch more jobs matching your current criteria.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
            {/* 🔥 BROWSE SIMILAR JOBS BUTTON */}
            <Button 
                onClick={onLoadMore} 
                size="lg" 
                className="w-full font-semibold text-lg h-12 gap-2"
                disabled={isLoadingMore}
            >
                {isLoadingMore ? <Loader2 className="animate-spin" /> : <ExternalLink className="size-5" />}
                {isLoadingMore ? "Fetching..." : "Browse Similar Jobs"}
            </Button>

            <Button onClick={handleReset} variant="ghost" className="w-full text-muted-foreground">
                <RotateCcw className="size-4 mr-2" /> Start Over
            </Button>
        </div>
      </div>
    )
  }

  // --- CARD VIEW ---
  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
      <div className="w-full h-[500px]"> {/* Fixed height container to prevent layout shifts */}
        <JobCard job={currentJob} swipeDirection={swipeDirection} onSwipe={handleSwipe} />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handleSkip}
          className="size-16 rounded-full p-0 border-2 border-zinc-400 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-transform active:scale-95"
        >
          <X className="size-8" />
        </Button>

        <Button
          size="lg"
          onClick={handleApply}
          className="size-16 rounded-full p-0 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95"
        >
          {currentJob.source === "LinkedIn" ? <ExternalLink className="size-8" /> : <CheckCheck className="size-10" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Job {currentIndex + 1} of {jobs.length}</span>
      </div>
    </div>
  )
}
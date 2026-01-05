"use client"

import { useState } from "react"
import { JobSwiper } from "@/components/jobs/job-swiper"
import { JobFilters } from "@/components/jobs/job-filters"
import { Loader2, SearchX } from "lucide-react"
import { showProfessionalToast } from "@/components/customToast"

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Track state for pagination
  const [page, setPage] = useState(0)
  const [currentFilters, setCurrentFilters] = useState(null)

  const fetchJobsData = async (filters, pageNum) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/external-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🔥 We request 20 jobs at a time now
        body: JSON.stringify({ ...filters, page: pageNum, limit: 20 }) 
    })
    return await res.json()
  }

  const handleDeepSearch = async (filters) => {
    if (!filters.keyword) {
        showProfessionalToast("Please enter a job title")
        return
    }

    setLoading(true)
    setJobs([]) 
    setPage(0) 
    setCurrentFilters(filters)

    try {
        const data = await fetchJobsData(filters, 0)
        
        if (data.success) {
            setJobs(data.jobs)
            if(data.msg) showProfessionalToast(data.msg)
            else showProfessionalToast(`Found ${data.count} live jobs!`)
        } else {
            showProfessionalToast(data.msg || "No jobs found")
        }
    } catch (err) {
        console.error(err)
        showProfessionalToast("Search failed")
    } finally {
        setLoading(false)
    }
  }

  // 🔥 FIXED: No side effects inside setJobs
  const handleLoadMore = async () => {
    if (!currentFilters) return;

    setLoadingMore(true);
    // Increment page by 20 (since we fetch 20 at a time now)
    const nextPage = page + 20; 

    try {
        const data = await fetchJobsData(currentFilters, nextPage);

        if (data.success && data.jobs.length > 0) {
            
            // 1. Filter Duplicates FIRST (Outside of setJobs)
            const uniqueNewJobs = data.jobs.filter(newJob => {
                const exists = jobs.some(existingJob => 
                    (existingJob.applyUrl && existingJob.applyUrl === newJob.applyUrl) ||
                    (existingJob.title === newJob.title && existingJob.company === newJob.company)
                );
                return !exists; 
            });

            // 2. Handle UI Logic
            if (uniqueNewJobs.length === 0) {
                showProfessionalToast("No new unique jobs found (duplicates skipped).");
                // We advance page anyway so next click tries the next batch
                setPage(nextPage);
            } else {
                showProfessionalToast(`Loaded ${uniqueNewJobs.length} new jobs`);
                // 3. Update State (Pure update)
                setJobs(prev => [...prev, ...uniqueNewJobs]);
                setPage(nextPage);
            }

        } else {
            showProfessionalToast("No more jobs found for this search.");
        }
    } catch (err) {
        showProfessionalToast("Failed to load more jobs");
    } finally {
        setLoadingMore(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Discover Jobs</h1>
            <p className="text-muted-foreground text-lg">Search LinkedIn live & Apply directly</p>
          </div>

          <JobFilters 
            onDeepSearch={handleDeepSearch} 
            isLoading={loading} 
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="size-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Scanning LinkedIn Listings...</p>
            </div>
          ) : jobs.length > 0 ? (
            <JobSwiper 
                jobs={jobs} 
                onLoadMore={handleLoadMore} 
                isLoadingMore={loadingMore}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground opacity-50">
                <SearchX className="size-16 mb-4" />
                <p>Enter a keyword and click Find Jobs to start</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
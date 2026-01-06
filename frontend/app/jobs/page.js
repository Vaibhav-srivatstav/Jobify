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
  
  // Track offset (0, 20, 40...)
  const [pageOffset, setPageOffset] = useState(0)
  const [currentFilters, setCurrentFilters] = useState(null)

  const fetchJobsData = async (filters, offset) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/external-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send 'page' as the raw offset (0, 20, 40)
        body: JSON.stringify({ ...filters, page: offset, limit: 20 }) 
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
    setPageOffset(0) 
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

  // 🔥 UPDATED: Smart Load More
  const handleLoadMore = async () => {
    if (!currentFilters) return;

    setLoadingMore(true);
    
    // Start recursion from current offset
    await tryFetchUnique(pageOffset);
    
    setLoadingMore(false);
  }

  // Recursive Helper Function
  const tryFetchUnique = async (currentOffset, attempt = 1) => {
        // Increment by 15 or 20 (LinkedIn pages are often 25, but 15 is safer to avoid skipping)
        const nextOffset = currentOffset + 15; 
        
        console.log(`🔄 Attempt ${attempt}: Fetching offset ${nextOffset}...`);
        
        try {
            const data = await fetchJobsData(currentFilters, nextOffset);

            if (data.success && data.jobs.length > 0) {
                
                // Filter Duplicates
                const uniqueNewJobs = data.jobs.filter(newJob => {
                    const exists = jobs.some(existingJob => 
                        (existingJob.applyUrl && existingJob.applyUrl === newJob.applyUrl) ||
                        (existingJob.title === newJob.title && existingJob.company === newJob.company)
                    );
                    return !exists; 
                });

                if (uniqueNewJobs.length > 0) {
                    // ✅ SUCCESS
                    setJobs(prev => [...prev, ...uniqueNewJobs]);
                    setPageOffset(nextOffset);
                    showProfessionalToast(`Loaded ${uniqueNewJobs.length} new jobs`);
                } else {
                    // ⚠️ DUPLICATES FOUND - RETRY?
                    if (attempt < 4) { // Try up to 4 times
                         // showProfessionalToast(`Scanning deeper (Attempt ${attempt})...`); 
                         await tryFetchUnique(nextOffset, attempt + 1);
                    } else {
                         showProfessionalToast("No more unique jobs found right now.");
                         setPageOffset(nextOffset); 
                    }
                }
            } else {
                showProfessionalToast("End of LinkedIn results.");
            }
        } catch (err) {
            console.error(err);
            showProfessionalToast("Error fetching more jobs.");
        }
  };

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
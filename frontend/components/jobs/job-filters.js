"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Search, Globe, Loader2, Briefcase, MapPin } from "lucide-react"

export function JobFilters({ onDeepSearch, isLoading }) {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  
  // Default values
  const [jobType, setJobType] = useState("full time")
  const [remoteFilter, setRemoteFilter] = useState("remote")

  const handleSubmit = (e) => {
    e.preventDefault()
    onDeepSearch({ 
        keyword, 
        location,
        jobType,
        remoteFilter
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 space-y-4">
      <form onSubmit={handleSubmit} className="bg-white/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm">
        
        {/* Row 1: Search Inputs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Job title (e.g. React Developer)" 
                    className="pl-9 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
            <div className="relative flex-1">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Location (e.g. India)" 
                    className="pl-9 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
        </div>

        {/* Row 2: Constraints (Professional Custom Selects) */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            
            {/* Job Type Select */}
            <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-black border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Briefcase className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="Job Type" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="full time">Full Time</SelectItem>
                    <SelectItem value="part time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="all">Any Type</SelectItem>
                </SelectContent>
            </Select>

            {/* Remote Select */}
            <Select value={remoteFilter} onValueChange={setRemoteFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-black border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="Location Type" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="remote">Remote Only</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="all">Any Location</SelectItem>
                </SelectContent>
            </Select>

            {/* Professional Black & White Button */}
            <Button 
                type="submit" 
                disabled={isLoading} 
                className="ml-auto w-full sm:w-auto px-8 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors border border-transparent dark:border-zinc-200"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin size-4 mr-2" />
                        Searching...
                    </>
                ) : (
                    "Find Jobs"
                )}
            </Button>
        </div>
      </form>
    </div>
  )
}
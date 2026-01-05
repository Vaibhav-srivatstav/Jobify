"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  Briefcase,
  Target,
  TrendingUp,
  Globe,
  Clock,
  ScanSearch,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function JobCard({ job, swipeDirection }) {
  const [matchScore, setMatchScore] = useState(0)
  const [atsScore, setAtsScore] = useState(0)
  const [showScores, setShowScores] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // State for skills
  const [matchedSkills, setMatchedSkills] = useState([]) 
  const [missingSkills, setMissingSkills] = useState([])
  const [userHasSkills, setUserHasSkills] = useState(true)

  // Reset state when job changes
  useEffect(() => {
    setShowScores(false)
    setIsAnalyzing(false)
    setMatchedSkills([])
    setMissingSkills([])
  }, [job])

  const performAnalysis = () => {
    // 1. Get User Profile
    const storedUser = localStorage.getItem("user");
    let userSkills = [];

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            // Handle different structure possibilities
            userSkills = user.skills || user.profile?.skills || [];
        } catch(e) {}
    }

    // ⛔ REALISM CHECK: If user has no skills, we can't analyze
    if (!userSkills || userSkills.length === 0) {
        setUserHasSkills(false);
        setIsAnalyzing(false);
        return; 
    } else {
        setUserHasSkills(true);
    }

    // 2. The Logic: Compare Server Data vs Local Data
    // We use the 'requiredSkills' array sent from the Backend
    const jobSkills = job.requiredSkills || [];
    
    // Find Matches (Case Insensitive)
    const matches = jobSkills.filter(jSkill => 
        userSkills.some(uSkill => uSkill.toLowerCase() === jSkill.toLowerCase())
    );

    // Find Missing
    const missing = jobSkills.filter(jSkill => 
        !userSkills.some(uSkill => uSkill.toLowerCase() === jSkill.toLowerCase())
    );

    // 3. Score Calculation
    let score = 0;
    
    if (jobSkills.length > 0) {
        // Math: (Matches / Total) * 100
        score = Math.round((matches.length / jobSkills.length) * 100);
    } else {
        // If backend found NO skills, default to neutral score
        score = 50; 
    }

    // Bonus: If title matches user title (simplified check)
    // score += 10; 

    const finalScore = Math.min(100, Math.max(0, score));
    // ATS is usually stricter, so we simulate a slight penalty
    const finalAts = Math.max(0, finalScore - 10); 

    setMatchScore(finalScore);
    setAtsScore(finalAts);
    setMatchedSkills(matches);
    setMissingSkills(missing);
  }

  const handleAnalyze = (e) => {
    e.stopPropagation(); 
    e.preventDefault();
    setIsAnalyzing(true);

    // 1.2s delay for UX "Scanning" effect
    setTimeout(() => {
        performAnalysis();
        
        // Only show results if we actually had a user profile to check against
        const storedUser = localStorage.getItem("user");
        if(storedUser && JSON.parse(storedUser).skills?.length > 0) {
            setShowScores(true);
        }
        
        setIsAnalyzing(false);
    }, 1200);
  }

  const getScoreColor = (score) => {
    if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
    if (score >= 40) return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
    return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
  }

  const jobTitle = job.title || job.role || "Job Opportunity";
  const timePosted = job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Recently";

  return (
    <Card
      className={cn(
        "relative border-border/50 shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col overflow-hidden",
        swipeDirection === "left" && "translate-x-[-100%] opacity-0",
        swipeDirection === "right" && "translate-x-[100%] opacity-0"
      )}
    >
      {/* Swipe Overlay */}
      {swipeDirection && (
        <div
          className={cn(
            "absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full z-20 tracking-wide shadow-sm",
            swipeDirection === "right"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          )}
        >
          {swipeDirection === "right" ? "APPLYING..." : "SKIPPING"}
        </div>
      )}

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate leading-tight tracking-tight">
              {jobTitle}
            </CardTitle>

            <CardDescription className="flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 truncate">
              <Building2 className="size-4 text-primary" /> {job.company}
            </CardDescription>

            <div className="flex flex-wrap gap-3 pt-1">
                <CardDescription className="flex items-center gap-1.5 text-xs">
                    <Globe className="size-3.5" /> {job.source || "External"}
                </CardDescription>
                <CardDescription className="flex items-center gap-1.5 text-xs">
                    <Clock className="size-3.5" /> {timePosted}
                </CardDescription>
            </div>
          </div>

          {/* Right Side: ATS Analyzer */}
          <div className="shrink-0 flex flex-col items-end min-w-[100px]">
            {!showScores ? (
                 <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="h-9 px-3 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-none transition-all shadow-sm"
                 >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="size-3.5 mr-2 animate-spin" />
                            Scanning...
                        </>
                    ) : (
                        <>
                            <ScanSearch className="size-3.5 mr-2" />
                            Analyze
                        </>
                    )}
                 </Button>
            ) : (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <Badge variant="outline" className={cn("px-2.5 py-1 text-xs font-bold shadow-sm justify-between w-28", getScoreColor(matchScore))}>
                        <div className="flex items-center">
                            <Target className="size-3 mr-1.5" /> Match
                        </div>
                        {matchScore}%
                    </Badge>

                    <Badge variant="outline" className={cn("px-2.5 py-1 text-xs font-bold shadow-sm justify-between w-28", getScoreColor(atsScore))}>
                         <div className="flex items-center">
                            <TrendingUp className="size-3 mr-1.5" /> ATS
                        </div>
                        {atsScore}
                    </Badge>
                </div>
            )}
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
            <MapPin className="size-3.5" /> {job.location}
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
            <Briefcase className="size-3.5" /> {job.type}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4 flex-1 flex flex-col">
        {/* Description */}
        <div>
          <h4 className="font-bold mb-2 text-xs text-black/70 dark:text-white/70 uppercase tracking-widest">
            Role Overview
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {job.description}
          </p>
        </div>

        {/* 🔥 DYNAMIC SKILLS SECTION */}
        {showScores ? (
            <div className="animate-in fade-in duration-700">
                <h4 className="font-bold mb-2 text-xs text-black/70 dark:text-white/70 uppercase tracking-widest flex items-center justify-between">
                    <span>Skill Analysis</span>
                    {matchScore > 50 && <CheckCircle2 className="size-3.5 text-emerald-500" />}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                    {/* 1. Show Matches (Green) */}
                    {matchedSkills.map((skill, idx) => (
                        <span key={`match-${idx}`} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                            {skill}
                        </span>
                    ))}
                    
                    {/* 2. Show Missing (Red/Gray) */}
                    {missingSkills.map((skill, idx) => (
                         <span key={`miss-${idx}`} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30 opacity-70">
                            {skill}
                        </span>
                    ))}

                    {matchedSkills.length === 0 && missingSkills.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">No specific skills found to compare.</span>
                    )}
                </div>
            </div>
        ) : (
            // Default view: Show extraction from Backend
            <div className="mt-auto pt-2">
                <h4 className="font-bold mb-2 text-xs text-black/70 dark:text-white/70 uppercase tracking-widest">
                    Keywords found
                </h4>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-hidden">
                    {job.requiredSkills && job.requiredSkills.length > 0 ? (
                        job.requiredSkills.map((req, idx) => (
                        <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 border-none px-2 py-0.5 font-normal"
                        >
                            {req}
                        </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground italic">Check job details</span>
                    )}
                </div>
            </div>
        )}

        {/* Warning if user has no profile */}
        {!userHasSkills && (
             <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-900/50 flex gap-2 items-start mt-2">
                <AlertCircle className="size-4 text-red-600 mt-0.5" />
                <div className="text-xs text-red-700 dark:text-red-300">
                    <p className="font-semibold">Profile missing</p>
                    <p>Add skills to your profile to run the scanner.</p>
                </div>
             </div>
        )}

        {/* Link */}
        {job.applyUrl && (
          <Link
            href={job.applyUrl}
            target="_blank"
            className="group flex items-center justify-center gap-1 text-center text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white mt-4 transition-colors"
          >
            View original posting 
            <ExternalLink className="size-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
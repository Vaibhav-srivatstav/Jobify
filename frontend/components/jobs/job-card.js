"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
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
  Clock,
  ScanSearch,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Banknote
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function JobCard({ job, swipeDirection, onSwipe }) {
  const [matchScore, setMatchScore] = useState(0)
  const [atsScore, setAtsScore] = useState(0)
  const [showScores, setShowScores] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const [matchedSkills, setMatchedSkills] = useState([]) 
  const [missingSkills, setMissingSkills] = useState([])
  const [userHasSkills, setUserHasSkills] = useState(true)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-8, 8]) 
  const opacityRight = useTransform(x, [0, 100], [0, 1]) 
  const opacityLeft = useTransform(x, [0, -100], [0, 1])

  useEffect(() => {
    setShowScores(false)
    setIsAnalyzing(false)
    setMatchedSkills([])
    setMissingSkills([])
    setImageError(false)
    x.set(0) 
  }, [job, x])

  const handleDragEnd = async (event, info) => {
    const offset = info.offset.x;
    const threshold = 100;

    if (offset > threshold) {
       await animate(x, 1000, { duration: 0.2 });
       if(onSwipe) onSwipe("right");
    } else if (offset < -threshold) {
       await animate(x, -1000, { duration: 0.2 });
       if(onSwipe) onSwipe("left");
    } else {
       animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  }

  const performAnalysis = () => {
    const storedUser = localStorage.getItem("user");
    let userSkills = [];
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            userSkills = user.skills || user.profile?.skills || [];
        } catch(e) {}
    }

    if (!userSkills || userSkills.length === 0) {
        setUserHasSkills(false);
        setIsAnalyzing(false);
        return; 
    } else {
        setUserHasSkills(true);
    }

    const jobSkills = job.requiredSkills || [];
    const matches = jobSkills.filter(jSkill => userSkills.some(uSkill => uSkill.toLowerCase() === jSkill.toLowerCase()));
    const missing = jobSkills.filter(jSkill => !userSkills.some(uSkill => uSkill.toLowerCase() === jSkill.toLowerCase()));

    let score = jobSkills.length > 0 ? Math.round((matches.length / jobSkills.length) * 100) : 50;
    const finalScore = Math.min(100, Math.max(0, score));
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
    setTimeout(() => {
        performAnalysis();
        const storedUser = localStorage.getItem("user");
        if(storedUser && JSON.parse(storedUser).skills?.length > 0) setShowScores(true);
        setIsAnalyzing(false);
    }, 1200);
  }

  const getScoreColor = (score) => {
    if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
    if (score >= 40) return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
    return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
  }

  const jobTitle = job.title || job.role || "Job Opportunity";
  const timeDisplay = job.postedAgo || (job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Recently");

  return (
    <motion.div
        style={{ x, rotate }}
        drag="x"
        dragElastic={0.7} 
        onDragEnd={handleDragEnd}
        className={cn(
            "h-full w-full cursor-grab active:cursor-grabbing touch-none",
            swipeDirection === "left" && "transition-transform duration-300 translate-x-[-150%] opacity-0",
            swipeDirection === "right" && "transition-transform duration-300 translate-x-[150%] opacity-0"
        )}
    >
    <Card className="relative border-border/50 shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col overflow-hidden bg-card">
      
      {/* Swipe Badges */}
      <motion.div style={{ opacity: opacityRight }} className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full z-20 tracking-wide shadow-sm bg-emerald-500 text-white pointer-events-none">APPLYING...</motion.div>
      <motion.div style={{ opacity: opacityLeft }} className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full z-20 tracking-wide shadow-sm bg-red-500 text-white pointer-events-none">SKIPPING</motion.div>

      {/* Fallback Badge */}
      {swipeDirection && !x.get() && (
        <div className={cn("absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full z-20 tracking-wide shadow-sm", swipeDirection === "right" ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
          {swipeDirection === "right" ? "APPLYING..." : "SKIPPING"}
        </div>
      )}

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start gap-4">
          
          {/* Logo + Titles (Now Full Width) */}
          <div className="flex gap-3 flex-1 min-w-0">
             <div className="size-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0 overflow-hidden">
                {job.logo && !imageError ? (
                    <img 
                        src={job.logo} 
                        alt={job.company} 
                        className="w-full h-full object-contain"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Building2 className="size-6 text-zinc-400" />
                )}
             </div>

             <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className="text-xl font-bold leading-tight tracking-tight">
                    {jobTitle}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 truncate">
                   {job.company}
                </CardDescription>
             </div>
          </div>
        </div>

        {/* Meta Info Row */}
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
            <MapPin className="size-3.5" /> {job.location || "Remote"}
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
            <Briefcase className="size-3.5" /> {job.type || "Full-time"}
          </div>
          {job.salary && job.salary !== "Not specified" && (
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-2.5 py-1 rounded-md text-xs font-bold">
                <Banknote className="size-3.5" /> {job.salary}
              </div>
          )}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium">
            <Clock className="size-3.5" /> {timeDisplay}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4 flex-1 flex flex-col">
        {/* Description */}
        <div onPointerDown={(e) => e.stopPropagation()} className="cursor-text">
          <h4 className="font-bold mb-2 text-xs text-black/70 dark:text-white/70 uppercase tracking-widest">
            Role Overview
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
            {job.description}
          </p>
        </div>

        {/* 🔥 MOVED ANALYZER BUTTON HERE (Fills the gap) */}
        {!showScores ? (
             <div onPointerDown={(e) => e.stopPropagation()} className="pt-2">
                 <Button 
                    variant="outline" 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing} 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-dashed border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-muted-foreground hover:text-foreground h-12"
                 >
                    {isAnalyzing ? <Loader2 className="size-4 mr-2 animate-spin" /> : <ScanSearch className="size-4 mr-2" />}
                    {isAnalyzing ? "Scanning Profile Match..." : "Analyze Match & Keywords"}
                 </Button>
             </div>
        ) : (
            // Results View
            <div className="animate-in fade-in duration-700 space-y-3 pt-2">
                <div className="flex gap-3">
                     <Badge variant="outline" className={cn("flex-1 py-1.5 justify-center text-sm font-bold shadow-sm", getScoreColor(matchScore))}>
                        <div className="flex items-center"><Target className="size-3.5 mr-2" /> Match {matchScore}%</div>
                    </Badge>
                    <Badge variant="outline" className={cn("flex-1 py-1.5 justify-center text-sm font-bold shadow-sm", getScoreColor(atsScore))}>
                         <div className="flex items-center"><TrendingUp className="size-3.5 mr-2" /> ATS {atsScore}</div>
                    </Badge>
                </div>
                
                <div className="space-y-2">
                    <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Keywords Detected</h4>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, idx) => (
                            <span key={`match-${idx}`} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">{skill}</span>
                        ))}
                        {missingSkills.map((skill, idx) => (
                             <span key={`miss-${idx}`} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30 opacity-70">{skill}</span>
                        ))}
                        {matchedSkills.length === 0 && missingSkills.length === 0 && (
                            <span className="text-xs text-muted-foreground italic">No specific skills found.</span>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Missing Profile Warning */}
        {!userHasSkills && (
             <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-900/50 flex gap-2 items-start">
                <AlertCircle className="size-4 text-red-600 mt-0.5" />
                <div className="text-xs text-red-700 dark:text-red-300">
                    <p className="font-semibold">Profile missing</p>
                    <p>Add skills to your profile to run the scanner.</p>
                </div>
             </div>
        )}

        {job.applyUrl && (
          <Link href={job.applyUrl} target="_blank" onPointerDown={(e) => e.stopPropagation()} className="group flex items-center justify-center gap-1 text-center text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white mt-auto pt-2 transition-colors">
            View original posting <ExternalLink className="size-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </CardContent>
    </Card>
    </motion.div>
  )
}
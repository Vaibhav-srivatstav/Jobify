"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export function AnalysisForm() {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async (e) => {
    e.preventDefault()

    if (!jobDescription.trim()) return

    setIsAnalyzing(true)

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Store analysis results
    const mockResults = {
      atsScore: Math.floor(Math.random() * 30) + 70, // 70-100
      matchScore: Math.floor(Math.random() * 30) + 65, // 65-95
      missingSkills: ["Kubernetes", "GraphQL", "CI/CD"],
      warnings: [
        "Resume length exceeds recommended 2 pages",
        "Missing specific years of experience",
        "No metrics or quantifiable achievements in recent role",
      ],
      timestamp: Date.now(),
    }

    localStorage.setItem("latest_analysis", JSON.stringify(mockResults))
    window.dispatchEvent(new Event("storage"))

    setIsAnalyzing(false)
  }

  // --- STYLING CONSTANTS ---
  // 1. Primary Button: Black (Light) / White (Dark)
  const btnPrimary = "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
  
  // 2. Input/Textarea: Neutral Focus Ring (Removes green glow)
  const inputFocus = "focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
        <CardDescription>Paste the job description to analyze resume compatibility</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the full job description here..."
              // UPDATED: Added neutral focus ring styles
              className={`min-h-75 resize-none ${inputFocus}`}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Include requirements, responsibilities, and qualifications</p>
          </div>

          {/* UPDATED: Button now uses solid Black/White styles */}
          <Button 
            type="submit" 
            className={`w-full ${btnPrimary}`} 
            disabled={isAnalyzing || !jobDescription.trim()}
          >
            {isAnalyzing && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isAnalyzing ? "Analyzing..." : "Analyze Match"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
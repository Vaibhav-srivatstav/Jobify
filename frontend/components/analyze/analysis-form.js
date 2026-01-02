"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { getUserId } from "@/lib/user-id"

// Receive the prop here ↓
export function AnalysisForm({ onAnalysisComplete }) {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const userId = getUserId()
      
      const response = await fetch('http://localhost:5000/api/analyze/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ jobDescription })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || "Analysis failed")
      }

      const formattedResults = {
        atsScore: data.matchScore,
        matchScore: data.matchScore,
        missingSkills: data.missingKeywords || [],
        verdict: data.verdict,
        explanation: data.explanation,
        timestamp: Date.now(),
      }

      // SEND DATA TO PARENT (No LocalStorage!)
      onAnalysisComplete(formattedResults)

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const btnPrimary = "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
  const inputFocus = "focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
        <CardDescription>Paste the job description to analyze resume compatibility</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="space-y-4 h-full flex flex-col">
          <div className="space-y-2 flex-1">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the full job description here..."
              className={`min-h-[300px] resize-none ${inputFocus}`}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Include requirements, responsibilities, and qualifications</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
               <AlertCircle className="size-4" />
               {error}
            </div>
          )}

          <Button 
            type="submit" 
            className={`w-full ${btnPrimary}`} 
            disabled={isAnalyzing || !jobDescription.trim()}
          >
            {isAnalyzing && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isAnalyzing ? "Analyzing with Gemini..." : "Analyze Match"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
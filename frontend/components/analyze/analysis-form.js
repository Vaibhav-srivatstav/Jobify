"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Upload, CheckCircle2 } from "lucide-react"


export function AnalysisForm({ onAnalysisComplete }) {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
   
      let response;

      // SEPARATE CALL LOGIC
      if (resumeFile) {
        // 1. Use FormData for Multi-part (File + JD)
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        formData.append("resume", resumeFile)

        response = await fetch("http://localhost:5000/api/analyze/match-file", {
          method: "POST",
          credentials:"include",
          // Note: Browser automatically sets Content-Type for FormData
          body: formData,
        })
      } else {
        // 2. Standard JSON call for existing DB profile
        response = await fetch("http://localhost:5000/api/analyze/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:"include",
          body: JSON.stringify({ jobDescription }),
        })
      }

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

      onAnalysisComplete(formattedResults)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      {/* Header with Integrated Action Button */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-transparent. pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl">Analysis Engine</CardTitle>
          <CardDescription>Compare your profile against specific requirements</CardDescription>
        </div>
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="bg-black hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:bg-white text-primary-foreground shadow-sm px-6"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Run Analysis"
          )}
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Job Description */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="job-description" className="font-semibold text-sm">
                Job Description
              </Label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Required
              </span>
            </div>
            <Textarea
              id="job-description"
              placeholder="Paste the role responsibilities and requirements here..."
              className="min-h-[180px] focus-visible:ring-1 resize-none bg-background"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>

          {/* Right Column: Optional Resume Upload */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-sm text-muted-foreground">
                Resume
              </Label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Optional
              </span>
            </div>
            
            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeSelect}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className={`
                  flex flex-col items-center justify-center w-full h-[180px] 
                  border-2 border-dashed rounded-lg transition-all cursor-pointer
                  ${resumeFile 
                    ? "border-green-500/50 bg-green-50/10 dark:bg-green-500/5" 
                    : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"}
                `}
              >
                <div className="flex flex-col items-center justify-center py-4 text-center px-4">
                  {resumeFile ? (
                    <>
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                        <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-xs font-medium truncate max-w-full italic">
                        {resumeFile.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">Click to change</p>
                    </>
                  ) : (
                    <>
                      <Upload className="size-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-xs font-medium">Upload PDF/Doc</p>
                      <p className="text-[10px] text-muted-foreground mt-1 px-2">
                        For auto-generating details later
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="md:col-span-12 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
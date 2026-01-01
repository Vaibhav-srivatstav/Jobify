"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, AlertTriangle, Target, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function AnalysisResults() {
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    // Load existing analysis
    const loadAnalysis = () => {
      const stored = localStorage.getItem("latest_analysis")
      if (stored) {
        setAnalysis(JSON.parse(stored))
      }
    }

    loadAnalysis()

    // Listen for new analysis
    const handleStorage = () => {
      loadAnalysis()
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  if (!analysis) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Results will appear here after analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Target className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Enter a job description and click analyze
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // PRESERVED: Logic for Score Colors (Green/Yellow/Red)
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-destructive"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Compatibility analysis between your resume and job description
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ATS Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-black dark:text-white" />
              <h4 className="font-semibold">ATS Score</h4>
            </div>
            <Badge
              variant="outline"
              className={getScoreColor(analysis.atsScore)}
            >
              {getScoreLabel(analysis.atsScore)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span
                className={`font-bold text-2xl ${getScoreColor(
                  analysis.atsScore
                )}`}
              >
                {analysis.atsScore}%
              </span>
            </div>
            <Progress value={analysis.atsScore} className="h-3" />
          </div>

          <p className="text-xs text-muted-foreground">
            How well your resume passes Applicant Tracking Systems
          </p>
        </div>

        {/* Match Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-black dark:text-white" />
              <h4 className="font-semibold">Resume-Job Match</h4>
            </div>
            <Badge
              variant="outline"
              className={getScoreColor(analysis.matchScore)}
            >
              {getScoreLabel(analysis.matchScore)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span
                className={`font-bold text-2xl ${getScoreColor(
                  analysis.matchScore
                )}`}
              >
                {analysis.matchScore}%
              </span>
            </div>
            <Progress value={analysis.matchScore} className="h-3" />
          </div>

          <p className="text-xs text-muted-foreground">
            How well your resume matches the job requirements
          </p>
        </div>

        {/* Missing Skills */}
        {analysis.missingSkills.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="size-5 text-destructive" />
              <h4 className="font-semibold">Missing Skills</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="destructive"
                  className="bg-destructive/10 text-destructive border-destructive/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Consider adding these skills to improve your match score
            </p>
          </div>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-500" />
              <h4 className="font-semibold">ATS Warnings</h4>
            </div>
            <div className="space-y-2">
              {analysis.warnings.map((warning, idx) => (
                <Alert
                  key={idx}
                  variant="default"
                  className="border-yellow-500/20 bg-yellow-500/5"
                >
                  <AlertTriangle className="size-4 text-yellow-500" />
                  <AlertDescription className="text-sm">
                    {warning}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

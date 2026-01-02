"use client"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, XCircle, CheckCircle2, MessageSquareQuote } from "lucide-react"

// Receive the data prop here ↓
export function AnalysisResults({ data }) {
  
  // If no data comes from parent (fresh load/refresh), show empty state
  if (!data) {
    return (
      <Card className="border-border/50 h-full flex flex-col justify-center">
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

  // If we have data, render it!
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-500"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-500"
    return "text-red-600 dark:text-red-500"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "High Match"
    if (score >= 60) return "Good Match"
    return "Low Match"
  }

  return (
    <Card className="border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Compatibility analysis between your resume and job description
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* Match Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-black dark:text-white" />
              <h4 className="font-semibold">Match Score</h4>
            </div>
            <Badge variant="outline" className={getScoreColor(data.matchScore)}>
              {getScoreLabel(data.matchScore)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Relevance</span>
              <span className={`font-bold text-2xl ${getScoreColor(data.matchScore)}`}>
                {data.matchScore}%
              </span>
            </div>
            <Progress value={data.matchScore} className="h-3" />
          </div>
        </div>

        {/* AI Verdict */}
        {(data.verdict || data.explanation) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="size-5 text-blue-500" />
              <h4 className="font-semibold">Recruiter Verdict</h4>
            </div>
            
            <Alert className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <AlertDescription className="text-sm space-y-2">
                    {data.verdict && (
                        <p className="font-semibold text-blue-700 dark:text-blue-300">
                            "{data.verdict}"
                        </p>
                    )}
                    {data.explanation && (
                        <p className="text-muted-foreground leading-relaxed">
                            {data.explanation}
                        </p>
                    )}
                </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Missing Skills */}
        {data.missingSkills && data.missingSkills.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="size-5 text-red-500" />
              <h4 className="font-semibold">Missing Keywords</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.missingSkills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Add these keywords to your resume to increase your score.
            </p>
          </div>
        ) : (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <CheckCircle2 className="size-5" />
                <span className="text-sm font-medium">Great job! No major keywords missing.</span>
            </div>
        )}

      </CardContent>
    </Card>
  )
}
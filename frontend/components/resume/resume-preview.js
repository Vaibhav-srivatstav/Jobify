"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import {
  Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code, 
  Loader2, AlertTriangle, CheckCircle, TrendingUp, FileText, Search
} from "lucide-react"

// 🔥 Accept the refreshTrigger prop
export function ResumePreview({ refreshTrigger = 0 }) {
  const [resumeData, setResumeData] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
        // 🔥 CLEAN REQUEST: No x-user-id, just credentials
        const res = await fetch(`http://localhost:5000/api/resume/profile`, {
            method: 'GET',
            credentials: 'include' // Sends JWT Cookie
        })
        
        if (res.ok) {
            const data = await res.json()
            setResumeData(data)
            setIsUploaded(true)
        } else {
            // If error, reset state
            setIsUploaded(false)
            setResumeData(null)
        }
    } catch (error) {
        console.error("Error fetching profile:", error)
        setIsUploaded(false)
        setResumeData(null)
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(() => {
    // 🔥 LOGIC: 
    // If refreshTrigger is 0 (Default/Refresh), do NOTHING. Keep empty.
    // If refreshTrigger is > 0 (After Upload), fetch data.
    if (refreshTrigger > 0) {
        fetchProfile()
    }
  }, [refreshTrigger])

  // 1. Loading State
  if (isLoading) {
    return (
      <Card className="border-border/50 h-full flex items-center justify-center min-h-[400px]">
         <div className="flex flex-col items-center gap-2 text-muted-foreground">
             <Loader2 className="size-8 animate-spin text-blue-600" />
             <p>Analyzing Resume & Calculating ATS Score...</p>
         </div>
      </Card>
    )
  }

  // 2. Empty State (Default)
  if (!isUploaded || !resumeData) {
    return (
      <Card className="border-border/50 h-full bg-muted/20 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center h-full space-y-6">
          <div className="size-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Search className="size-10 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-2xl font-bold">Resume Intelligence</h3>
            <p className="text-muted-foreground text-sm">
              Upload your resume to unlock a detailed analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md text-left text-sm">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border shadow-sm">
                <TrendingUp className="size-5 text-green-500" />
                <span>ATS Score Calculation</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border shadow-sm">
                <AlertTriangle className="size-5 text-yellow-500" />
                <span>Missing Keywords</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border shadow-sm">
                <FileText className="size-5 text-blue-500" />
                <span>Parsed Profile</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border shadow-sm">
                <CheckCircle className="size-5 text-purple-500" />
                <span>Improvement Tips</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score) => {
      if (score >= 80) return "text-green-500";
      if (score >= 60) return "text-yellow-500";
      return "text-red-500";
  }

  return (
    <div className="space-y-6">
    
    <Card className="border-border/50 bg-blue-50/50 dark:bg-blue-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" /> ATS Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Overall ATS Score</p>
                <div className={`text-4xl font-bold ${getScoreColor(resumeData.atsScore || 0)}`}>
                    {resumeData.atsScore || 0}/100
                </div>
            </div>
            <div className="size-16 rounded-full border-4 border-muted flex items-center justify-center relative bg-background">
                <span className="text-sm font-bold">{resumeData.atsScore || 0}%</span>
            </div>
        </div>

        <Separator />

        {resumeData.missingKeywords && resumeData.missingKeywords.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-500">
                    <AlertTriangle className="size-4" /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                    {resumeData.missingKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="border-red-200 text-red-600 bg-red-50 dark:bg-red-900/10">
                            {keyword}
                        </Badge>
                    ))}
                </div>
            </div>
        )}

        {resumeData.improvements && resumeData.improvements.length > 0 && (
            <div>
                 <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-500">
                    <CheckCircle className="size-4" /> Suggested Improvements
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {resumeData.improvements.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                    ))}
                </ul>
            </div>
        )}

      </CardContent>
    </Card>

    {/* Resume Details Card */}
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-bold mb-3">{resumeData.name}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              {resumeData.email}
            </div>
            {resumeData.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                {resumeData.phone}
                </div>
            )}
            {resumeData.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {resumeData.location}
                </div>
            )}
          </div>
        </div>

        <Separator />

        {resumeData.summary && (
            <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="size-4" /> Professional Summary
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {resumeData.summary}
            </p>
            </div>
        )}
        
        <Separator />

        {resumeData.experience && (
            <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="size-4" /> Experience
            </h4>
            <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                <div key={idx}>
                    <div className="font-medium">{exp.title}</div>
                    <div className="text-sm text-muted-foreground">{exp.company}</div>
                    <div className="text-xs text-muted-foreground mb-2">{exp.duration}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                    </p>
                </div>
                ))}
            </div>
            </div>
        )}

        <Separator />

        {resumeData.projects && (
            <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Code className="size-4" /> Projects
            </h4>
            <div className="space-y-4">
                {resumeData.projects.map((project, idx) => (
                <div key={idx}>
                    <div className="font-medium">{project.name}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                    {project.technologies && project.technologies.map((tech) => (
                        <span key={tech} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {tech}
                        </span>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        <Separator />

        {resumeData.education && (
            <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="size-4" /> Education
            </h4>
            {resumeData.education.map((edu, idx) => (
                <div key={idx}>
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-muted-foreground">{edu.school}</div>
                <div className="text-xs text-muted-foreground">{edu.year}</div>
                </div>
            ))}
            </div>
        )}

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills && resumeData.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
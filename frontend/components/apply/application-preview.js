"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, DollarSign, FileText, ExternalLink, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export function ApplicationPreview({ jobId }) {
  const router = useRouter()
  const [application, setApplication] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load application from localStorage
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const app = applications.find((a) => a.id === jobId)

    if (app) {
      // Add generated cover letter
      app.coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${app.role} position at ${app.company}. With my background in software engineering and proven track record of delivering high-quality solutions, I am confident I would be a valuable addition to your team.

My experience aligns well with your requirements, as evidenced by the ${app.matchScore}% match score. I have consistently demonstrated expertise in modern web technologies and best practices, which makes me well-suited for this role.

I am particularly drawn to ${app.company}'s innovative approach and would welcome the opportunity to contribute to your continued success. I am excited about the possibility of joining your team in ${app.location}.

Thank you for considering my application. I look forward to discussing how my skills and experience can benefit ${app.company}.

Best regards,
${localStorage.getItem("user_name") || "Applicant"}`
      setApplication(app)
    }
  }, [jobId])

  const handleApply = async () => {
    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update application status
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApps = applications.map((app) => {
      if (app.id === jobId) {
        return { ...app, status: "SUBMITTED" }
      }
      return app
    })
    localStorage.setItem("applications", JSON.stringify(updatedApps))

    // Navigate to success page or applications list
    router.push("/applications")
  }

  if (!application) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading application...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Job Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-2xl">{application.role}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <Building2 className="size-4" />
                {application.company}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Match: {application.matchScore}%
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                ATS: {application.atsScore}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              {application.location}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="size-4" />
              {application.salary}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-filled Application Data */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>Auto-filled from your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-sm mt-1">{localStorage.getItem("user_name") || "John Doe"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm mt-1">{localStorage.getItem("user_email") || "john@example.com"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-sm mt-1">+1 (555) 123-4567</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-sm mt-1">San Francisco, CA</p>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <FileText className="size-4" />
              Resume
            </label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 border border-border">
              <CheckCircle2 className="size-4 text-green-500" />
              <span className="text-sm">{localStorage.getItem("resume_name") || "Resume.pdf"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Cover Letter */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Cover Letter</CardTitle>
          <CardDescription>AI-generated based on your profile and the job description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {application.coverLetter}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card className="border-border/50 bg-accent/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Ready to submit your application?</p>
              <p>You'll be redirected to {application.company}'s application page</p>
            </div>
            <Button size="lg" onClick={handleApply} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Apply on Company Site
                  <ExternalLink className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

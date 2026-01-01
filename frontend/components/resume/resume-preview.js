"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
} from "lucide-react"

export function ResumePreview() {
  const [resumeData, setResumeData] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)

  useEffect(() => {
    const uploaded = localStorage.getItem("resume_uploaded") === "true"
    setIsUploaded(uploaded)

    if (uploaded) {
      // Mock parsed resume data
      setResumeData({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        summary:
          "Experienced software engineer with 5+ years in full-stack development, specializing in React and Node.js.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            duration: "2021 - Present",
            description:
              "Led development of enterprise web applications using React, TypeScript, and AWS.",
          },
          {
            title: "Software Engineer",
            company: "Digital Innovations",
            duration: "2019 - 2021",
            description:
              "Developed and maintained multiple client-facing web applications.",
          },
        ],
        projects: [
          {
            name: "E-Commerce Dashboard",
            description:
              "A comprehensive analytics dashboard for online retailers with real-time data visualization.",
            technologies: ["React", "D3.js", "Firebase"],
          },
          {
            name: "Task Management API",
            description:
              "RESTful API built for a collaborative task management tool with websocket support.",
            technologies: ["Node.js", "Express", "MongoDB"],
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            school: "University of California",
            year: "2019",
          },
        ],
        skills: [
          "React",
          "TypeScript",
          "Node.js",
          "Python",
          "AWS",
          "Docker",
          "PostgreSQL",
          "Git",
        ],
      })
    }
  }, [])

  if (!isUploaded || !resumeData) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Resume Preview</CardTitle>
          <CardDescription>Your parsed resume will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Briefcase className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Upload a resume to see the preview
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
        <CardDescription>
          Parsed information from your resume
        </CardDescription>
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              {resumeData.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {resumeData.location}
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Award className="size-4" />
            Professional Summary
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {resumeData.summary}
          </p>
        </div>

        <Separator />

        {/* Experience */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="size-4" />
            Experience
          </h4>
          <div className="space-y-4">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="font-medium">{exp.title}</div>
                <div className="text-sm text-muted-foreground">
                  {exp.company}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {exp.duration}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Projects */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Code className="size-4" />
            Projects
          </h4>
          <div className="space-y-4">
            {resumeData.projects.map((project, idx) => (
              <div key={idx}>
                <div className="font-medium">{project.name}</div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Education */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="size-4" />
            Education
          </h4>
          {resumeData.education.map((edu, idx) => (
            <div key={idx}>
              <div className="font-medium">{edu.degree}</div>
              <div className="text-sm text-muted-foreground">
                {edu.school}
              </div>
              <div className="text-xs text-muted-foreground">{edu.year}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Skills */}
        <div>
          <h4 className="font-semibold mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { JobCard } from "@/components/jobs/job-card"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, ExternalLink, CheckCheck } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock Jobs with URL/source
const MOCK_JOBS = [
  {
    id: "1",
    company: "TechVision Corp",
    role: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    salary: "$150k - $200k",
    type: "Full-time",
    description:
      "We're seeking an experienced Full Stack Developer to join our growing team. You'll work on cutting-edge web applications using React, Node.js, and AWS.",
    requirements: ["5+ years experience", "React & TypeScript", "Node.js", "AWS", "Docker"],
    matchScore: 92,
    atsScore: 88,
    source: "LinkedIn",
    url: "https://linkedin.com/jobs/view/1",
  },
  {
    id: "2",
    company: "Innovation Labs",
    role: "Frontend Engineer",
    location: "Remote",
    salary: "$120k - $160k",
    type: "Full-time",
    description:
      "Join our team to build beautiful, performant user interfaces. We value clean code, great design, and exceptional user experiences.",
    requirements: ["3+ years experience", "React", "TypeScript", "CSS/Tailwind", "Testing"],
    matchScore: 85,
    atsScore: 90,
    source: "Indeed",
    url: "https://indeed.com/jobs/view/2",
  },
  {
    id: "3",
    company: "DataScale Inc",
    role: "Software Engineering Lead",
    location: "New York, NY",
    salary: "$180k - $230k",
    type: "Full-time",
    description:
      "Lead a team of talented engineers building scalable data platforms. You'll architect solutions and mentor junior developers.",
    requirements: ["7+ years experience", "Leadership", "System Design", "Python/Go", "Kubernetes"],
    matchScore: 78,
    atsScore: 82,
    source: "Company Website",
    url: "https://datascale.com/jobs/3",
  },
  {
    id: "4",
    company: "CloudFirst Solutions",
    role: "DevOps Engineer",
    location: "Austin, TX",
    salary: "$130k - $170k",
    type: "Full-time",
    description:
      "Help us build and maintain robust CI/CD pipelines and cloud infrastructure. Experience with AWS and Kubernetes required.",
    requirements: ["4+ years experience", "AWS/GCP", "Kubernetes", "Terraform", "CI/CD"],
    matchScore: 72,
    atsScore: 85,
    source: "LinkedIn",
    url: "https://linkedin.com/jobs/view/4",
  },
  {
    id: "5",
    company: "StartupXYZ",
    role: "Full Stack Engineer",
    location: "Los Angeles, CA",
    salary: "$110k - $150k",
    type: "Full-time",
    description:
      "Early-stage startup looking for a versatile engineer to help build our MVP. Great opportunity for equity and growth.",
    requirements: ["2+ years experience", "JavaScript/TypeScript", "React", "Node.js", "MongoDB"],
    matchScore: 88,
    atsScore: 91,
    source: "Indeed",
    url: "https://indeed.com/jobs/view/5",
  },
]

export function JobSwiper() {
  const router = useRouter()
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(null)

  const currentJob = jobs[currentIndex]

  const handleSwipe = (direction) => {
    setSwipeDirection(direction)

    setTimeout(() => {
      if (direction === "right") {
        const applications = JSON.parse(localStorage.getItem("applications") || "[]")

        applications.push({
          ...currentJob,
          status: "READY",
          appliedAt: new Date().toISOString(),
        })

        localStorage.setItem("applications", JSON.stringify(applications))
        router.push(`/apply/${currentJob.id}`)
      }

      if (currentIndex < jobs.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSwipeDirection(null)
      } else {
        setCurrentIndex(jobs.length)
      }
    }, 300)
  }

  const handleSkip = () => handleSwipe("left")
  const handleApply = () => handleSwipe("right")

  const handleReset = () => {
    setCurrentIndex(0)
    setSwipeDirection(null)
  }

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="size-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
          <ExternalLink className="size-12 text-black dark:text-white" />
        </div>

        <h2 className="text-2xl font-bold mb-2">No more jobs!</h2>
        <p className="text-muted-foreground mb-6">
          You've reviewed all available positions
        </p>

        <Button
          onClick={handleReset}
          variant="outline"
          className="border-zinc-400 dark:border-zinc-700 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          <RotateCcw className="size-4 mr-2" />
          Review Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
      <div className="w-full">
        <JobCard job={currentJob} swipeDirection={swipeDirection} />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handleSkip}
          className="size-16 rounded-full p-0 border-2 border-zinc-400 dark:border-zinc-700 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          <X className="size-8" />
          <span className="sr-only">Skip</span>
        </Button>

        <Button
          size="lg"
          onClick={handleApply}
          className="size-16 rounded-full p-0 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-black dark:border-white"
        >
          <CheckCheck className="size-10" />
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {currentIndex + 1} / {jobs.length}
        </span>
      </div>
    </div>
  )
}

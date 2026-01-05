"use client"

import { useState } from "react"
import { ResumeUpload } from "@/components/resume/resume-upload"
import { ResumePreview } from "@/components/resume/resume-preview"

export default function ResumePage() {
  // This state controls when the preview should update
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">ATS Analysis</h1>
            <p className="text-muted-foreground text-lg">
              Upload and manage your resume for optimized applications
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* 1. We pass a function to the Upload component */}
            <ResumeUpload onUploadSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
            
            {/* 2. We pass the trigger value to the Preview component */}
            <ResumePreview refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  )
}
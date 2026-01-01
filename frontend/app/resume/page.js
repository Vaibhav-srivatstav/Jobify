import { ResumeUpload } from "@/components/resume/resume-upload"
import { ResumePreview } from "@/components/resume/resume-preview"

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Resume</h1>
            <p className="text-muted-foreground text-lg">Upload and manage your resume for optimized applications</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ResumeUpload />
            <ResumePreview />
          </div>
        </div>
      </main>
    </div>
  )
}

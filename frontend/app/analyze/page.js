import { AnalysisForm } from "@/components/analyze/analysis-form"
import { AnalysisResults } from "@/components/analyze/analysis-results"

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-background">
    
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">ATS Analysis</h1>
            <p className="text-muted-foreground text-lg">Analyze how well your resume matches a job description</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <AnalysisForm />
            <AnalysisResults />
          </div>
        </div>
      </main>
    </div>
  )
}

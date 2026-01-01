import { ApplicationPreview } from "@/components/apply/application-preview"

export default async function ApplyPage({ params }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
    
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Application Preview</h1>
            <p className="text-muted-foreground text-lg">Review your application before submitting</p>
          </div>

          <ApplicationPreview jobId={id} />
        </div>
      </main>
    </div>
  )
}

"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle2, X } from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("idle")

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find((file) => file.type === "application/pdf")

    if (pdfFile) {
      handleFileUpload(pdfFile)
    }
  }, [])

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file) => {
    setUploadedFile(file)
    setUploadStatus("uploading")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setUploadStatus("success")
    localStorage.setItem("resume_uploaded", "true")
    localStorage.setItem("resume_name", file.name)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadStatus("idle")
    localStorage.removeItem("resume_uploaded")
    localStorage.removeItem("resume_name")
  }

  const btnProfessional =
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"

  const iconContainerBlue =
    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"

  const dragActiveStyle =
    "border-blue-600 bg-blue-50 dark:bg-blue-900/10"

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>
          Upload your resume in PDF format for ATS analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {uploadStatus === "success" && uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-accent/50">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${iconContainerBlue}`}>
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="size-5 text-green-500" />
              <p className="text-sm font-medium text-green-500">
                Resume uploaded successfully!
              </p>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
              isDragging ? dragActiveStyle : "border-border",
              uploadStatus === "uploading" && "opacity-50 pointer-events-none"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`size-16 rounded-full flex items-center justify-center ${iconContainerBlue}`}>
                <Upload className="size-8" />
              </div>

              <div>
                <p className="font-medium mb-1">
                  {uploadStatus === "uploading"
                    ? "Uploading..."
                    : "Drop your resume here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>

              <input
                type="file"
                id="resume-upload"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploadStatus === "uploading"}
              />

              <Button asChild disabled={uploadStatus === "uploading"} className={btnProfessional}>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  Select PDF
                </label>
              </Button>

              <p className="text-xs text-muted-foreground">
                PDF files only, max 10MB
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

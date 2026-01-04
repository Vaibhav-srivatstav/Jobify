"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, X, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
// Ensure this path matches your project structure
import { showProfessionalToast } from "../customToast"; 

export function ResumeUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  // Simulated Progress Logic
  useEffect(() => {
    let interval;
    if (uploadStatus === "uploading") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          // Fast at first, then slows down, never hits 100% until done
          if (prev >= 90) return prev; 
          return prev + Math.random() * 10;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [uploadStatus]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");
    if (pdfFile) handleFileUpload(pdfFile);
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        if (typeof showProfessionalToast === 'function') {
            showProfessionalToast("File is too large. Max size is 2MB.");
        } else {
            alert("File is too large. Max size is 2MB.")
        }
        return;
      }
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setUploadStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      await response.json(); 

      // Finish the progress bar smoothly
      setProgress(100);
      
      // Small delay to let user see 100%
      setTimeout(() => {
          setUploadStatus("success");
          if (onUploadSuccess) {
            onUploadSuccess();
          }
      }, 500);

    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      setUploadedFile(null);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setProgress(0);
  };

  const btnProfessional = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500";
  const iconContainerBlue = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  const dragActiveStyle = "border-blue-600 bg-blue-50 dark:bg-blue-900/10";

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>
          Upload your resume in PDF format for ATS analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {uploadStatus === "error" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">
              Upload failed. Please try again.
            </p>
          </div>
        )}

        {/* LOADING STATE (New & Animated) */}
        {uploadStatus === "uploading" ? (
             <div className="border-2 border-border rounded-lg p-8 text-center space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        {/* Spinning ring */}
                        <div className="size-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin dark:border-blue-900/30 dark:border-t-blue-500"></div>
                        {/* Icon in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="size-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="font-medium text-lg">Analyzing Resume...</p>
                        <p className="text-sm text-muted-foreground">
                            Extracting skills, experience, and ATS compatibility.
                        </p>
                    </div>
                </div>

                {/* The Progress Bar */}
                <div className="space-y-2 max-w-xs mx-auto w-full">
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}%</p>
                </div>
             </div>
        ) : uploadStatus === "success" && uploadedFile ? (
            
          /* SUCCESS STATE */
          <div className="space-y-4 animate-in fade-in zoom-in-95">
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
                Processed by AI successfully!
              </p>
            </div>
          </div>
        ) : (
            
          /* DEFAULT DROPZONE STATE */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer hover:bg-accent/50",
              isDragging ? dragActiveStyle : "border-border"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`size-16 rounded-full flex items-center justify-center ${iconContainerBlue}`}
              >
                <Upload className="size-8" />
              </div>

              <div>
                <p className="font-medium mb-1">Drop your resume here</p>
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
              />

              <Button
                asChild
                className={btnProfessional}
              >
                <label htmlFor="resume-upload" className="cursor-pointer">
                  Select PDF
                </label>
              </Button>

              <p className="text-xs text-muted-foreground">
                PDF files only (Max 2MB)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
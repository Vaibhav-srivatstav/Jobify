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
import { FileText, CheckCircle2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
// Ensure this path matches your project structure
import { showProfessionalToast } from "@/components/customToast"; 

export function ResumeUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("Choose a file");

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
    if (pdfFile) {
        setFileName(pdfFile.name);
        handleFileUpload(pdfFile);
    } else {
        showProfessionalToast("Only PDF files are allowed.");
    }
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
      setFileName(file.name);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setUploadStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // 🔥 UPDATED: Using Environment Variable
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/upload`, {
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
    setFileName("Choose a file");
  };

  const iconContainerBlue = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>
          Upload your resume in PDF format for ATS analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* --- ERROR STATE --- */}
        {uploadStatus === "error" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">
              Upload failed. Please try again.
            </p>
          </div>
        )}

        {/* --- LOADING STATE (Pyramid Loader) --- */}
        {uploadStatus === "uploading" ? (
             <div className="border-2 border-border rounded-lg p-8 text-center space-y-6 flex flex-col items-center overflow-hidden">
                
                {/* Pyramid CSS Scoped */}
                <style jsx>{`
                    .pyramid-loader {
                        position: relative;
                        width: 300px;
                        height: 150px; /* Reduced height to fit card better, original was 300px */
                        display: block;
                        transform-style: preserve-3d;
                        transform: rotateX(-20deg);
                    }

                    .wrapper {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transform-style: preserve-3d;
                        animation: spin 4s linear infinite;
                    }

                    @keyframes spin {
                        100% {
                            transform: rotateY(360deg);
                        }
                    }

                    .pyramid-loader .wrapper .side {
                        width: 70px;
                        height: 70px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        transform-origin: center top;
                        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    }

                    .pyramid-loader .wrapper .side1 {
                        transform: rotateZ(-30deg) rotateY(90deg);
                        background: conic-gradient( #2BDEAC, #F028FD, #D8CCE6, #2F2585);
                    }

                    .pyramid-loader .wrapper .side2 {
                        transform: rotateZ(30deg) rotateY(90deg);
                        background: conic-gradient( #2F2585, #D8CCE6, #F028FD, #2BDEAC);
                    }

                    .pyramid-loader .wrapper .side3 {
                        transform: rotateX(30deg);
                        background: conic-gradient( #2F2585, #D8CCE6, #F028FD, #2BDEAC);
                    }

                    .pyramid-loader .wrapper .side4 {
                        transform: rotateX(-30deg);
                        background: conic-gradient( #2BDEAC, #F028FD, #D8CCE6, #2F2585);
                    }

                    .pyramid-loader .wrapper .shadow {
                        width: 60px;
                        height: 60px;
                        background: #8B5AD5;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        transform: rotateX(90deg) translateZ(-40px);
                        filter: blur(12px);
                    }
                `}</style>

                {/* Pyramid HTML */}
                <div className="pyramid-loader">
                    <div className="wrapper">
                        <span className="side side1"></span>
                        <span className="side side2"></span>
                        <span className="side side3"></span>
                        <span className="side side4"></span>
                        <span className="shadow"></span>
                    </div>  
                </div>
                
                <div className="space-y-1">
                    <p className="font-medium text-lg">Analyzing Resume...</p>
                    <p className="text-sm text-muted-foreground">
                        Extracting skills, experience, and ATS compatibility.
                    </p>
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
            
          /* --- SUCCESS STATE --- */
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
            
          /* --- FOLDER UPLOAD DESIGN --- */
          <div 
            className="w-full flex flex-col items-center justify-center py-6"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
             {/* Component Styles Scoped */}
             <style jsx>{`
                .uiverse-container {
                --transition: 350ms;
                --folder-W: 120px;
                --folder-H: 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                padding: 10px;
                background: linear-gradient(135deg, #6dd5ed, #2193b0);
                border-radius: 15px;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                height: calc(var(--folder-H) * 1.7);
                position: relative;
                width: 100%;
                max-width: 280px;
                }

                .folder {
                position: absolute;
                top: -20px;
                left: calc(50% - 60px);
                animation: float 2.5s infinite ease-in-out;
                transition: transform var(--transition) ease;
                }

                .folder:hover {
                transform: scale(1.05);
                }

                .folder .front-side,
                .folder .back-side {
                position: absolute;
                transition: transform var(--transition);
                transform-origin: bottom center;
                }

                .folder .back-side::before,
                .folder .back-side::after {
                content: "";
                display: block;
                background-color: white;
                opacity: 0.5;
                z-index: 0;
                width: var(--folder-W);
                height: var(--folder-H);
                position: absolute;
                transform-origin: bottom center;
                border-radius: 15px;
                transition: transform 350ms;
                z-index: 0;
                }

                .uiverse-container:hover .back-side::before {
                transform: rotateX(-5deg) skewX(5deg);
                }
                .uiverse-container:hover .back-side::after {
                transform: rotateX(-15deg) skewX(12deg);
                }

                .folder .front-side {
                z-index: 1;
                }

                .uiverse-container:hover .front-side {
                transform: rotateX(-40deg) skewX(15deg);
                }

                .folder .tip {
                background: linear-gradient(135deg, #ff9a56, #ff6f56);
                width: 80px;
                height: 20px;
                border-radius: 12px 12px 0 0;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                position: absolute;
                top: -10px;
                z-index: 2;
                }

                .folder .cover {
                background: linear-gradient(135deg, #ffe563, #ffc663);
                width: var(--folder-W);
                height: var(--folder-H);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                }

                .custom-file-upload {
                font-size: 1.1em;
                color: #ffffff;
                text-align: center;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: background var(--transition) ease;
                display: inline-block;
                width: 100%;
                padding: 10px 20px;
                position: relative;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                backdrop-filter: blur(4px);
                }

                .custom-file-upload:hover {
                background: rgba(255, 255, 255, 0.4);
                }

                .custom-file-upload input[type="file"] {
                display: none;
                }

                @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
                }
            `}</style>

            <div className={cn("uiverse-container transition-transform", isDragging && "scale-105 ring-4 ring-blue-400/30")}>
                <div className="folder">
                <div className="front-side">
                    <div className="tip"></div>
                    <div className="cover"></div>
                </div>
                <div className="back-side cover"></div>
                </div>
                
                <label className="custom-file-upload">
                <input 
                    className="title" 
                    type="file" 
                    onChange={handleFileInput}
                    accept=".pdf"
                />
                {fileName}
                </label>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
                PDF files only (Max 2MB)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";

export function AnalysisForm({ onAnalysisComplete }) {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      let response;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        formData.append("resume", resumeFile);

        // 🔥 UPDATED: Using Environment Variable
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/match-file`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
      } else {
        // 🔥 UPDATED: Using Environment Variable
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/match`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ jobDescription }),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Analysis failed");
      }

      const formattedResults = {
        atsScore: data.matchScore,
        matchScore: data.matchScore,
        missingSkills: data.missingKeywords || [],
        verdict: data.verdict,
        explanation: data.explanation,
        timestamp: Date.now(),
      };

      onAnalysisComplete(formattedResults);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      {/* CSS Styles for Loader & Upload Button */}
      <style jsx>{`
        /* --- RESUME UPLOAD BUTTON CSS --- */
        .input-div {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid rgb(1, 235, 252);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          box-shadow: 0px 0px 100px rgb(1, 235, 252),
            inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
          animation: flicker 2s linear infinite;
        }

        .icon {
          color: rgb(1, 235, 252);
          font-size: 2rem;
          cursor: pointer;
          animation: iconflicker 2s linear infinite;
        }

        .input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer !important;
        }

        @keyframes flicker {
          0% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0px 0px 100px rgb(1, 235, 252),
              inset 0px 0px 10px rgb(1, 235, 252),
              0px 0px 5px rgb(255, 255, 255);
          }
          5% {
            border: none;
            box-shadow: none;
          }
          10% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0px 0px 100px rgb(1, 235, 252),
              inset 0px 0px 10px rgb(1, 235, 252),
              0px 0px 5px rgb(255, 255, 255);
          }
          25% {
            border: none;
            box-shadow: none;
          }
          30% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0px 0px 100px rgb(1, 235, 252),
              inset 0px 0px 10px rgb(1, 235, 252),
              0px 0px 5px rgb(255, 255, 255);
          }
          100% {
            border: 2px solid rgb(1, 235, 252);
            box-shadow: 0px 0px 100px rgb(1, 235, 252),
              inset 0px 0px 10px rgb(1, 235, 252),
              0px 0px 5px rgb(255, 255, 255);
          }
        }

        @keyframes iconflicker {
          0% {
            opacity: 1;
          }
          5% {
            opacity: 0.2;
          }
          10% {
            opacity: 1;
          }
          25% {
            opacity: 0.2;
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }

        /* --- PAGE FLIP LOADER CSS --- */
        .loader {
          --background: linear-gradient(135deg, #23c4f8, #275efe);
          --shadow: rgba(39, 94, 254, 0.28);
          --text: #6c7486;
          --page: rgba(255, 255, 255, 0.36);
          --page-fold: rgba(255, 255, 255, 0.52);
          --duration: 3s;
          width: 200px;
          height: 140px;
          position: relative;
        }

        .loader:before,
        .loader:after {
          --r: -6deg;
          content: "";
          position: absolute;
          bottom: 8px;
          width: 120px;
          top: 80%;
          box-shadow: 0 16px 12px var(--shadow);
          transform: rotate(var(--r));
        }

        .loader:before {
          left: 4px;
        }
        .loader:after {
          --r: 6deg;
          right: 4px;
        }

        .loader div {
          width: 100%;
          height: 100%;
          border-radius: 13px;
          position: relative;
          z-index: 1;
          perspective: 600px;
          box-shadow: 0 4px 6px var(--shadow);
          background-image: var(--background);
        }

        .loader div ul {
          margin: 0;
          padding: 0;
          list-style: none;
          position: relative;
        }
        .loader div ul li {
          --r: 180deg;
          --o: 0;
          --c: var(--page);
          position: absolute;
          top: 10px;
          left: 10px;
          transform-origin: 100% 50%;
          color: var(--c);
          opacity: var(--o);
          transform: rotateY(var(--r));
          -webkit-animation: var(--duration) ease infinite;
          animation: var(--duration) ease infinite;
        }

        .loader div ul li:nth-child(2) {
          --c: var(--page-fold);
          -webkit-animation-name: page-2;
          animation-name: page-2;
        }
        .loader div ul li:nth-child(3) {
          --c: var(--page-fold);
          -webkit-animation-name: page-3;
          animation-name: page-3;
        }
        .loader div ul li:nth-child(4) {
          --c: var(--page-fold);
          -webkit-animation-name: page-4;
          animation-name: page-4;
        }
        .loader div ul li:nth-child(5) {
          --c: var(--page-fold);
          -webkit-animation-name: page-5;
          animation-name: page-5;
        }

        .loader div ul li svg {
          width: 90px;
          height: 120px;
          display: block;
        }
        .loader div ul li:first-child {
          --r: 0deg;
          --o: 1;
        }
        .loader div ul li:last-child {
          --o: 1;
        }

        .loader span {
          display: block;
          left: 0;
          right: 0;
          top: 100%;
          margin-top: 20px;
          text-align: center;
          color: var(--text);
        }

        @keyframes page-2 {
          0% {
            transform: rotateY(180deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          35%,
          100% {
            opacity: 0;
          }
          50%,
          100% {
            transform: rotateY(0deg);
          }
        }
        @keyframes page-3 {
          15% {
            transform: rotateY(180deg);
            opacity: 0;
          }
          35% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
          65%,
          100% {
            transform: rotateY(0deg);
          }
        }
        @keyframes page-4 {
          30% {
            transform: rotateY(180deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          65%,
          100% {
            opacity: 0;
          }
          80%,
          100% {
            transform: rotateY(0deg);
          }
        }
        @keyframes page-5 {
          45% {
            transform: rotateY(180deg);
            opacity: 0;
          }
          65% {
            opacity: 1;
          }
          80%,
          100% {
            opacity: 0;
          }
          95%,
          100% {
            transform: rotateY(0deg);
          }
        }
      `}</style>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-transparent pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl">Analysis Engine</CardTitle>
          <CardDescription>
            Compare your profile against specific requirements
          </CardDescription>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="bg-black hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:bg-white text-primary-foreground shadow-sm px-6"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Run Analysis"
          )}
        </Button>
      </CardHeader>

      <CardContent className="pt-6 relative min-h-[300px]">
        {isAnalyzing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg transition-all duration-300">
            <div className="loader">
              <div>
                <ul>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                </ul>
              </div>
              <span>Analyzing...</span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleAnalyze}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Left Column: Job Description */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="job-description"
                className="font-semibold text-sm"
              >
                Job Description
              </Label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Required
              </span>
            </div>
            <Textarea
              id="job-description"
              placeholder="Paste the role responsibilities and requirements here..."
              className="min-h-[180px] focus-visible:ring-1 resize-none bg-background"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>

          {/* Right Column: Optional Resume Upload */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-sm text-muted-foreground">
                Resume
              </Label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Optional
              </span>
            </div>

            {/* NEW UPLOAD BUTTON DESIGN */}
            <div className="flex flex-col items-center justify-center space-y-4 py-4 min-h-[180px] border rounded-lg bg-muted/20">
              <div className="input-div">
                <input
                  className="input"
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeSelect}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="icon"
                >
                  <polyline points="16 16 12 12 8 16"></polyline>
                  <line y2="21" x2="12" y1="12" x1="12"></line>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                  <polyline points="16 16 12 12 8 16"></polyline>
                </svg>
              </div>

              <div className="text-center px-4">
                {resumeFile ? (
                  <div className="text-sm font-medium text-emerald-500 break-all">
                    {resumeFile.name}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click the circle to upload PDF
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="md:col-span-12 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

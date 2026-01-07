"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export function RecentApplications({ demoMode = false }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(!demoMode);

  useEffect(() => {
    // 1. IF DEMO MODE: Load Fake Data
    if (demoMode) {
      setApplications([
        {
          id: "1",
          company: "TechCorp Inc.",
          role: "Senior Software Engineer",
          status: "SUBMITTED",
          atsScore: 85,
          matchScore: 92,
          appliedAt: "2 days ago",
        },
        {
          id: "2",
          company: "Innovation Labs",
          role: "Full Stack Developer",
          status: "READY",
          atsScore: 78,
          matchScore: 88,
          appliedAt: "3 days ago",
        },
        {
          id: "3",
          company: "Digital Solutions",
          role: "Frontend Engineer",
          status: "SUBMITTED",
          atsScore: 92,
          matchScore: 95,
          appliedAt: "5 days ago",
        },
      ]);
      setLoading(false);
      return;
    }

    // 2. IF REAL MODE: Fetch from API
    const fetchApps = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/application/history?userId=${
            user._id || user.id
          }`
        );
        const data = await res.json();
        console.log(data)
        if (Array.isArray(data)) {
          const formattedApps = data.slice(0, 5).map((app) => ({
            id: app._id,
            company: app.jobId?.company || "Unknown Company",
            role: app.jobId?.title || "Unknown Role",
            status: app.status,
            companyLogo: app.jobId?.companyLogo,
            atsScore: Math.floor(Math.random() * (95 - 70) + 70),
            matchScore: Math.floor(Math.random() * (98 - 75) + 75),
            appliedAt: new Date(app.createdAt).toLocaleDateString(),
          }));
          setApplications(formattedApps);
        }
      } catch (err) {
        console.error("Failed to load recent applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [demoMode]);

  const getStatusColor = (status) => {
    switch (status) {
      case "READY":
      case "APPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "SUBMITTED":
      case "INTERVIEW":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
      case "OFFER":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "FAILED":
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  if (loading) {
    return (
      <Card className="border border/50 h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <Card className="border border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Real-time application tracking</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/applications">
            View all <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No applications yet. Start swiping!
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-transparent hover:border-border/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                {/* Company Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    {app.companyLogo ? (
                      <img
                        src={app.companyLogo}
                        alt={app.company}
                        className="w-full h-full object-contain"
                        />
                    ) : (
                      <Building2 className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm truncate max-w-[150px]">
                      {app.role}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {app.company}
                    </p>
                  </div>
                </div>

            

                {/* Status & Date */}
                <div className="flex items-center justify-between md:justify-end gap-4 min-w-[140px]">
                  <Badge
                    variant="outline"
                    className={getStatusColor(app.status)}
                  >
                    {app.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground text-right min-w-[70px]">
                    {app.appliedAt}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

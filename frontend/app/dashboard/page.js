"use client";

import { useEffect, useState } from "react";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  FileCheck,
  XCircle,
  Loader2,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentApplications } from "@/components/dashboard/recent-applications";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });
  const [chartData, setChartData] = useState({
    activity: [],
    status: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        // Fetch History from Backend for Stats & Charts
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/application/history?userId=${
            user._id || user.id
          }`
        );
        const apps = await res.json();

        if (Array.isArray(apps)) {
          processData(apps);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (apps) => {
    // 1. Calculate Summary Stats
    const counts = {
      total: apps.length,
      applied: apps.filter((a) => a.status === "APPLIED").length,
      interview: apps.filter((a) => a.status === "INTERVIEW").length,
      offer: apps.filter((a) => a.status === "OFFER").length,
      rejected: apps.filter((a) => a.status === "REJECTED").length,
    };
    setStats(counts);

    // 2. Prepare Pie Chart Data
    const statusChartData = [
      { name: "Applied", value: counts.applied, color: "#3b82f6" },
      { name: "Interview", value: counts.interview, color: "#a855f7" },
      { name: "Offer", value: counts.offer, color: "#10b981" },
      { name: "Rejected", value: counts.rejected, color: "#ef4444" },
    ].filter((item) => item.value > 0);

    // 3. Prepare Bar Chart Data
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        count: 0,
      };
    });

    apps.forEach((app) => {
      const appDate = app.createdAt.split("T")[0];
      const dayObj = last7Days.find((d) => d.date === appDate);
      if (dayObj) dayObj.count += 1;
    });

    const activityChartData = last7Days.map((d) => ({
      name: d.dayName,
      apps: d.count,
    }));

    setChartData({ activity: activityChartData, status: statusChartData });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 pb-20">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => router.push("/jobs")}
            className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
          >
            <Search className="mr-2 h-4 w-4" /> Find Jobs
          </Button>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time tracked jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interview}</div>
            <p className="text-xs text-muted-foreground">
              Active conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offer}</div>
            <p className="text-xs text-muted-foreground">
              Success rate:{" "}
              {stats.total > 0
                ? Math.round((stats.offer / stats.total) * 100)
                : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Visual Analytics Charts */}
      <div className="pt-4">
        <AnalyticsChart
          activityData={chartData.activity}
          statusData={chartData.status}
        />
      </div>

      {/* 3. Recent Activity & Quick Actions Grid */}
      <QuickActions />
      <RecentApplications />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Recent Applications (Span 4) */}
        <div className="col-span-full lg:col-span-4"></div>
      </div>
    </div>
  );
}

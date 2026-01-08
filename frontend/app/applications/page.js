"use client";

import { ApplicationsList } from "@/components/applications/applications-list";
import { ApplicationFilters } from "@/components/applications/application-filters";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return; // Handle redirect if needed
        const user = JSON.parse(storedUser);

        // Note: If your getHistory API uses req.body.userId, switch to POST or use query param
        // Assuming your previous getHistory implementation:
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/application/history?userId=${
            user._id || user.id
          }`
        );

        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground text-lg">
              Track and manage your job applications
            </p>
          </div>

          <ApplicationFilters applications={applications} />

          {/* Pass data and setter to the Kanban Board */}
          <ApplicationsList
            applications={applications}
            setApplications={setApplications}
          />
        </div>
      </main>
    </div>
  );
}

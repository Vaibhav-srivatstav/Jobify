"use client";

import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import FeaturesBento from "@/components/FeatureBento";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem("auth_token");
    router.push(token ? "/dashboard" : "/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-cyan-400 selection:text-black">
      <header className="relative overflow-hidden bg-white dark:bg-black pt-16 pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 bg-cyan-400/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-cyan-500/20 rounded-full blur-[160px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900 mb-8">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>AI-Powered Job Hunting</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl md:text-8xl">
            Swipe Right on Your{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
              Next Career.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Stop filling out endless forms. Upload your resume, see your match
            score, and apply to thousands of jobs with a single swipe.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleClick}
              size="lg"
              className="h-14 rounded-full px-8 text-lg font-bold gap-2
              bg-cyan-400 text-black
              hover:bg-cyan-300
              shadow-[0_0_40px_rgba(34,211,238,0.45)]
              transition-all"
            >
              Start Swiping Now
              <ArrowRight className="h-5 w-5" />
            </Button>

            {/* Social proof */}
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 dark:border-black"
                />
              ))}
              <div className="flex items-center justify-center h-10 px-3 rounded-full border-2 border-white bg-zinc-900 text-white text-xs font-bold dark:border-black">
                +10k
              </div>
            </div>
          </div>
        </div>
      </header>

{/* DASHBOARD PREVIEW */}
<section className="relative mt-32">
  {/* ambient glow */}
 <div className="relative mx-auto max-w-6xl px-4 py-20"> {/* Added padding for glow room */}
  
  {/* THE UNIFORM GLOW LAYER */}
  <div className="absolute inset-0 m-auto h-[80%] w-[90%] bg-cyan-400/30 blur-[120px] rounded-full -z-10" />

  <div
    className="
      relative
      rounded-[28px]
      bg-white/90 dark:bg-zinc-900/90
      backdrop-blur-xl
      border border-zinc-200/60 dark:border-zinc-800/60
      shadow-[0_0_190px_40px_rgba(34,211,238,0.3)]
      overflow-hidden
    "
  >
    {/* macOS top bar */}
    <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
      </div>
      <span className="ml-4 text-xs font-medium text-zinc-400">
        Jobify · Dashboard Preview
      </span>
    </div>

    {/* NON-INTERACTIVE PREVIEW */}
    <div className="pointer-events-none relative p-6 sm:p-8 max-h-130 sm:max-h-none overflow-hidden">
      <div className="space-y-6 sm:space-y-8">
        <DashboardStats />
        <AnalyticsChart />
        <QuickActions />
        <RecentApplications demoMode={true} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white/80 dark:from-zinc-900/80 to-transparent" />
    </div>
  </div>
</div>

</section>



      {/* FEATURES */}
      <FeaturesBento />
    </div>
  );
}

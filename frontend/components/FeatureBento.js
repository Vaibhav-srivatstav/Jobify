"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Briefcase,
  ShieldCheck,
  Brain,
  Target,
} from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function FeaturesBento() {
  return (
    <section className="py-28 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight">
            Everything you need to land the right job
          </h2>
          <p className="mt-4 text-zinc-500">
            Built with AI at the core — from resume analysis to intelligent job discovery.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-6"
        >
          {/* Instant Analysis (Large) */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-3 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Instant Resume Analysis</h3>
            </div>
            <p className="mt-4 text-zinc-500">
              Upload your resume and get an ATS score, keyword insights, and
              improvement suggestions in seconds.
            </p>
          </motion.div>

          {/* AI Job Matching */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-3 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">AI Job Matching Engine</h3>
            </div>
            <p className="mt-4 text-zinc-500">
              Our models match your profile with jobs based on skills, role fit,
              seniority, and ATS compatibility — not just keywords.
            </p>
          </motion.div>

          {/* Tinder for Jobs */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8"
          >
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Swipe-Based Job Discovery</h3>
            <p className="mt-2 text-zinc-500">
              Swipe right on jobs you like, skip the rest. Simple, fast, addictive.
            </p>
          </motion.div>

          {/* Skill Gap Detection */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Skill Gap Insights</h3>
            <p className="mt-2 text-zinc-500">
              See exactly which skills you’re missing for a role — and how to fix them.
            </p>
          </motion.div>

          {/* Auto-Apply Prep */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8"
          >
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Auto-Apply Ready</h3>
            <p className="mt-2 text-zinc-500">
              Generate tailored cover letters and application answers instantly.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

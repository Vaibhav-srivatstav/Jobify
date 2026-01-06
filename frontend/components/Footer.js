"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Twitter, Linkedin, Github, X } from "lucide-react";
import Image from "next/image";
import logo from "../public/logo.png";
import logo2 from "../public/logo2.png";

export function Footer() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setDateTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t bg-white py-12 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* MAIN COMPACT ROW */}
        <div className="flex flex-col justify-center md:justify-between md:flex-row justify-between items-start md:items-center gap-8">
          {/* BRAND + DESCRIPTION + LINKS */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-full flex items-center justify-center">
                {/* Image 1: Light Mode */}
                <Image
                  src={logo}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="block dark:hidden"
                />
                {/* Image 2: Dark Mode */}
                <Image
                  src={logo2}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="hidden dark:block"
                />
              </div>
              <span className="font-semibold text-lg text-black dark:text-white">
                Jobify
              </span>
            </Link>

            <div className="text-zinc-500 text-sm leading-relaxed flex justify-between flex-wrap gap-x-6 gap-y-2 items-center">
              <p>
                The next generation of job hunting. 
                <br/>
                Use AI to find your dream roles.
              </p>

              
            </div>
          </div>
          <div className="flex text-sm gap-4 text-zinc-400">
                <Link
                  href="/applications"
                  className="hover:text-cyan-400 transition-colors hover:underline"
                >
                  Applications
                </Link>
                <Link
                  href="/analyze"
                  className="hover:text-cyan-400 transition-colors hover:underline"
                >
                  Matcher
                </Link>
                <Link
                  href="/resume"
                  className="hover:text-cyan-400 transition-colors hover:underline"
                >
                  ATS
                </Link>
                <Link
                  href="/jobs"
                  className="hover:text-cyan-400 transition-colors hover:underline"
                >
                  Jobs
                </Link>
              </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500">
            © 2025 Jobify AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              Systems Operational
            </div>

            <span className="text-xs text-zinc-500 font-mono border-l pl-6 border-zinc-200 dark:border-zinc-800">
              {dateTime}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

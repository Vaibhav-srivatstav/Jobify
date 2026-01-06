"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Twitter, Linkedin, Github, X } from "lucide-react"
import Image from "next/image"
import logo from '../public/logo.png';
import logo2 from '../public/logo2.png';
export function Footer() {
  const [dateTime, setDateTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      setDateTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t bg-white pt-24 pb-12 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-2">
            
            <Link href="/" className="flex items-center gap-2">
      <div className="size-8 rounded-full flex items-center justify-center">
        <span className="font-bold text-xl">
          
          {/* Image 1: Light Mode (Visible by default, hidden in dark mode) */}
          <Image 
            src={logo} 
            alt="Logo" 
            width={48} 
            height={50} 
            className="block dark:hidden" 
          />

          {/* Image 2: Dark Mode (Hidden by default, visible in dark mode) */}
          <Image 
            src={logo2} 
            alt="Logo" 
            width={48} 
            height={50} 
            className="hidden dark:block" 
          />

        </span>
      </div>
      <span className="hidden sm:inline font-semibold text-sm text-black dark:text-white">
        Jobify
      </span>
    </Link>
            <p className="max-w-xs text-zinc-500 mb-8 leading-relaxed">
              The next generation of job hunting. Use AI to find and apply to
              your dream roles with a simple swipe.
            </p>

            <div className="flex gap-4">
              {[X, Linkedin, Github].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800
                  flex items-center justify-center text-zinc-400
                  hover:text-cyan-400 hover:border-cyan-400
                  hover:shadow-[0_0_12px_rgba(34,211,238,0.35)]
                  transition-all"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-zinc-500">
              <li><Link href="#features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link href="/jobs" className="hover:text-cyan-400 transition-colors">Job Feed</Link></li>
              <li><Link href="/analyze" className="hover:text-cyan-400 transition-colors">Resume Analysis</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-zinc-500">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-zinc-500">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-zinc-500">
            © 2025 Jobify AI. Built with ❤️ for job seekers everywhere.
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            All systems operational
          </div>

          <span className="text-sm text-zinc-500 font-mono">
            {dateTime}
          </span>
        </div>
      </div>
    </footer>
  )
}

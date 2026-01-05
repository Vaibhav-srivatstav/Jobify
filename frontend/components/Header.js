"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
// 🔥 IMPORT AvatarImage here
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, LogIn, Menu, X, Sun, Moon } from "lucide-react";
import logo from "../public/logo.png";
import logo2 from "../public/logo2.png";
import { showProfessionalToast } from "./customToast";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState(""); // 🔥 New State for Image
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => setMounted(true), []);
  
  useEffect(() => {
    // 1. INSTANT LOAD from LocalStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
        setUserAvatar(user.avatar || ""); // 🔥 Load the avatar immediately
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }

    // 2. BACKGROUND SYNC (Optional but good)
    // We check /api/auth/me just in case the session is invalid
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" }
        );
        
        if (res.ok) {
           const data = await res.json();
           setUserName(data.user?.name || "User");
           setUserAvatar(data.user?.avatar || ""); // Sync latest avatar
           setIsLoggedIn(true);
           // Update localStorage to keep it fresh
           localStorage.setItem("user", JSON.stringify(data.user));
        } else {
           // If token is invalid, but we have localStorage, 
           // usually we might want to clear it, or just let them stay "visually" logged in until they click something.
           // For now, we leave it to prevent flickering.
        }
      } catch {
        // Only reset if we really can't connect and have no local data
        if (!storedUser) {
            setUserName("User");
            setIsLoggedIn(false);
        }
      }
    };

    fetchUser();
  }, [pathname]);

  // Close mobile menu on navigation
  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserName("User");
      setUserAvatar(""); // Clear avatar
      showProfessionalToast("Logged out");
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      showProfessionalToast(err.message || "Error logging out");
    }
  };

  if (!mounted) return null;

  const navClass = (path) =>
    `relative group px-1 py-0.5 transition ${
      pathname === path
        ? "text-black dark:text-white font-semibold"
        : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-4 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between rounded-full bg-white/10 dark:bg-black/80 border border-white/10 dark:border-none shadow-[0_4px_20px_-6px_rgba(0,0,0,0.15)] dark:shadow-[0_0_12px_0_rgba(255,255,255,0.18)] backdrop-blur-md dark:backdrop-blur-md px-6 transition-colors duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <span className="font-bold text-xl">
                <Image src={logo} alt="Logo" width={48} height={50} className="block dark:hidden" />
                <Image src={logo2} alt="Logo" width={48} height={50} className="hidden dark:block" />
              </span>
            </div>
            <span className="hidden sm:inline font-semibold text-sm text-black dark:text-white">Jobify</span>
          </Link>

          {/* Desktop Nav */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {[
                { name: "Dashboard", path: "/dashboard" },
                { name: "Find Jobs", path: "/jobs" },
                { name: "Applications", path: "/applications" },
                { name: "Resume", path: "/resume" },
              ].map((link) => (
                <Link key={link.path} href={link.path} className={navClass(link.path)}>
                  <span className="relative group">
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
                  </span>
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="flex items-center justify-center rounded-full p-2 hover:bg-black/10 hover:text-black dark:hover:text-white dark:hover:bg-white/10 transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border hover:text-black border-zinc-100 shadow-xs dark:shadow-xs dark:border-zinc-900 text-black dark:text-white rounded-full px-3 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <Avatar className="size-7">

                    <AvatarImage src={userAvatar || null} className="object-cover" />
                    <AvatarFallback className="bg-white text-black text-xs font-bold">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{userName}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/analyze">Matcher</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/resume">ATS Analysis</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="size-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login"><LogIn className="size-4 mr-2" /> Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger */}
            {isLoggedIn && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                className="md:hidden flex items-center justify-center rounded-full p-2 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isLoggedIn && (
        <div className={`md:hidden mt-3 mx-4 rounded-2xl bg-white/10 dark:bg-black/90 border border-white/10 dark:border-white/20 backdrop-blur transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-col items-center gap-4 py-6 text-black dark:text-white">
            {[
              { name: "Dashboard", path: "/dashboard" },
              { name: "Find Jobs", path: "/jobs" },
              { name: "Applications", path: "/applications" },
              { name: "ATS Analysis", path: "/resume" },
            ].map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setMobileOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
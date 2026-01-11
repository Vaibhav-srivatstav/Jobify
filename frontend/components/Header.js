"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, LogIn } from "lucide-react";
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
  const [userAvatar, setUserAvatar] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => setMounted(true), []);
   
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
        setUserAvatar(user.avatar || ""); 
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }

    const fetchUser = async () => {
      try {
        // Keeps the session check pointing to internal API for consistency
        const res = await fetch(
          `/api/me`, // Optional: You might want to create a bridge for this too later
          { credentials: "include" }
        );
        
        if (res.ok) {
           const data = await res.json();
           setUserName(data.user?.name || "User");
           setUserAvatar(data.user?.avatar || ""); 
           setIsLoggedIn(true);
           localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch {
        if (!storedUser) {
            setUserName("User");
            setIsLoggedIn(false);
        }
      }
    };

    fetchUser();
  }, [pathname]);

  useEffect(() => setMobileOpen(false), [pathname]);

  // ✅ UPDATED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      // 1. Call Next.js API Route (The Bridge) to delete the cookie
      await fetch("/api/logout", {
        method: "POST", // Changed to POST for security standard
      });
      
      // 2. Clear Local Storage
      localStorage.removeItem("user");
      
      // 3. Reset State
      setIsLoggedIn(false);
      setUserName("User");
      setUserAvatar(""); 
      
      showProfessionalToast("Logged out");
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      showProfessionalToast(err.message || "Error logging out");
    }
  };

  if (!mounted) return null;

  const isLight = theme === "light";

  const getFirstName = (name) => {
    if (!name) return "User";
    return name.split(" ")[0];
  };

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
                { name: "Jobs", path: "/jobs" },
                { name: "Applications", path: "/applications" },
                { name: "ATS Analysis", path: "/resume" },
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
            
            {/* Day/Night Toggle */}
            <label className="relative inline-block w-[4em] h-[2.2em] rounded-[30px] shadow-[0_0_10px_rgba(0,0,0,0.1)] text-[12px] sm:text-[14px]">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={isLight}
                onChange={() => setTheme(isLight ? "dark" : "light")}
              />
              
              {/* Slider Background */}
              <span 
                className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[30px] overflow-hidden transition-colors duration-400"
                style={{ backgroundColor: isLight ? "#00a6ff" : "#2a2a2a" }} 
              >
                {/* Stars */}
                <div className={`absolute bg-white rounded-full w-[5px] h-[5px] transition-all duration-400 left-[2.5em] top-[0.5em] ${isLight ? "opacity-0" : "opacity-100"}`}></div>
                <div className={`absolute bg-white rounded-full w-[5px] h-[5px] transition-all duration-400 left-[2.2em] top-[1.2em] ${isLight ? "opacity-0" : "opacity-100"}`}></div>
                <div className={`absolute bg-white rounded-full w-[5px] h-[5px] transition-all duration-400 left-[3em] top-[0.9em]    ${isLight ? "opacity-0" : "opacity-100"}`}></div>
                
                {/* Cloud */}
                <svg 
                  viewBox="0 0 16 16" 
                  className={`absolute w-[3.5em] bottom-[-1.4em] left-[-1.1em] transition-all duration-400 fill-white ${isLight ? "opacity-100" : "opacity-0"}`}
                >
                  <path
                    transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                    d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                  ></path>
                </svg>

                {/* Knob */}
                <div 
                  className="absolute h-[1.2em] w-[1.2em] rounded-[20px] left-[0.5em] bottom-[0.5em] transition-all duration-400 ease-[cubic-bezier(0.81,-0.04,0.38,1.5)]"
                  style={{
                    transform: isLight ? "translateX(1.8em)" : "translateX(0)",
                    boxShadow: isLight 
                      ? "inset 0.88em -0.23em 0px 0.88em #ffcf48" 
                      : "inset 0.47em -0.23em 0px 0px #fff"
                  }}
                ></div>
              </span>
            </label>

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
                  <span className="hidden sm:inline text-sm">{getFirstName(userName)}</span>
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

            {/* ANIMATED HAMBURGER MENU */}
            {isLoggedIn && (
              <label className="md:hidden cursor-pointer text-black dark:text-white text-[12px] h-[3em] flex items-center">
                <input 
                  type="checkbox" 
                  checked={mobileOpen} 
                  onChange={() => setMobileOpen(!mobileOpen)} 
                  className="hidden" 
                />
                <svg 
                  viewBox="0 0 32 32" 
                  className={`h-[3em] transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileOpen ? '-rotate-45' : ''}`}
                >
                  <path 
                    className="fill-none stroke-current stroke-linecap-round stroke-linejoin-round stroke-[2] transition-[stroke-dasharray,stroke-dashoffset] duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    style={{
                      strokeDasharray: mobileOpen ? '20 300' : '12 63',
                      strokeDashoffset: mobileOpen ? '-32.42' : '0'
                    }}
                  ></path>
                  <path 
                    className="fill-none stroke-current stroke-linecap-round stroke-linejoin-round stroke-[2]" 
                    d="M7 16 27 16"
                  ></path>
                </svg>
              </label>
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
              { name: "Jobs", path: "/jobs" },
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

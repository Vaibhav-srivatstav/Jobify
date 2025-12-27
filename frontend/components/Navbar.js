"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Home,
  FileUser,
  ScanText,
  Briefcase,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  // Base items always shown
  const items = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Resume",
      href: "/resume",
      icon: FileUser,
    },
    {
      title: "ATS",
      href: "/ats",
      icon: ScanText,
    },
    {
      title: "Jobs",
      href: "/jobs",
      icon: Briefcase,
    },
  ];

  // Auth items as "floating dock" special items
  const authItems = [
    {
      title: "Auth",
      render: (
        <>
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton>
                <button className="bg-gray-800 text-white rounded-full px-4 py-2 text-sm">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full px-4 py-2 text-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </>
      ),
    },
  ];

  

  return (
    <FloatingDock items={items}/>
  );
}

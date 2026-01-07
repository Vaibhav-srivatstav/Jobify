import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Jobify AI - Smart Job Tracker",
  description:
    "AI-powered job application platform with ATS optimization and smart matching",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo2.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <head />
      <body className="font-sans antialiased" >
        <Providers>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
          <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

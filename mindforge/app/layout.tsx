import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindForge by Sreekar Reddy - Mindmap + Kanban + Notes Workspace",
  description: "MindForge by Sreekar Reddy - A powerful 3-in-1 productivity suite combining visual mind mapping, kanban task management, and markdown notes. Local-first, elegant, and designed for deep work.",
  keywords: ["Sreekar Reddy mindforge", "Sreekar Reddy projects", "mind map", "kanban board", "note taking app", "productivity workspace", "task management", "visual thinking"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://mindforge.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://mindforge.vercel.app",
    title: "MindForge by Sreekar Reddy - Productivity Workspace",
    description: "Powerful 3-in-1 workspace: Mind Map, Kanban Board, and Notes Editor. Forge your ideas into reality.",
    siteName: "MindForge by Sreekar Reddy",
    images: ["/icon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindForge by Sreekar Reddy - Productivity Workspace",
    description: "Powerful 3-in-1 workspace: Mind Map, Kanban Board, and Notes Editor.",
    images: ["/icon.svg"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "M2DsCJTIe9s1V0OR2mGrrr_xeaYWrwTLvJ622qwIt0M",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

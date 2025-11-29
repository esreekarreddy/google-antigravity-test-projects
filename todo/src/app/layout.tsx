import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimal Todo by Sreekar Reddy - Simple Task Manager",
  description: "Minimal Todo by Sreekar Reddy - A clean, minimalist todo app for managing your tasks. Fast, responsive, and distraction-free. No sign-up required.",
  keywords: ["Sreekar Reddy todo", "Sreekar Reddy task manager", "Sreekar Reddy projects", "minimal todo app", "simple task manager", "free todo list"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://sr-todo-list.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://sr-todo-list.vercel.app",
    title: "Minimal Todo by Sreekar Reddy",
    description: "Clean, minimalist todo app. Fast and distraction-free. Created by Sreekar Reddy.",
    siteName: "Minimal Todo by Sreekar Reddy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimal Todo by Sreekar Reddy",
    description: "Clean, minimalist todo app. Fast and distraction-free.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "M2DsCJTIe9s1V0OR2mGrrr_xeaYWrwTLvJ622qwIt0M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

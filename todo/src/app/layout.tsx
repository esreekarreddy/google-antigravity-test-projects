import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimal Todo - Simple Task Manager | Free Online",
  description: "A clean, minimalist todo app for managing your tasks. Fast, responsive, and distraction-free. No sign-up required - start organizing your tasks instantly.",
  keywords: ["todo app", "task manager", "to-do list", "productivity", "minimal todo", "Sreekar Reddy"],
  authors: [{ name: "Sreekar Reddy" }],
  creator: "Sreekar Reddy",
  metadataBase: new URL("https://sr-todo-list.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://sr-todo-list.vercel.app",
    title: "Minimal Todo - Simple Task Manager",
    description: "Clean, minimalist todo app. Fast and distraction-free.",
    siteName: "Minimal Todo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimal Todo - Simple Task Manager",
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

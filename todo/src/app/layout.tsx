import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// JSON-LD structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Minimal Todo",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web Browser",
      "description": "A clean, minimalist todo app for managing your tasks. Fast, responsive, and distraction-free.",
      "url": "https://todo.sreekarreddy.com",
      "author": {
        "@type": "Person",
        "@id": "https://sreekarreddy.com/#person",
        "name": "Sreekar Reddy",
        "url": "https://sreekarreddy.com",
        "sameAs": [
          "https://linkedin.com/in/esreekarreddy",
          "https://github.com/esreekarreddy",
          "https://twitter.com/esreekarreddy"
        ]
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Dark mode minimalist design",
        "Local storage persistence",
        "Smooth animations",
        "Mobile responsive"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://todo.sreekarreddy.com",
      "name": "Minimal Todo by Sreekar Reddy",
      "description": "A clean, minimalist todo app for managing your tasks. Fast, responsive, and distraction-free.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sreekar Reddy Projects",
        "url": "https://sreekarreddy.com"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "Minimal Todo by Sreekar Reddy - Simple Task Manager",
  description:
    "Minimal Todo by Sreekar Reddy - A clean, minimalist todo app for managing your tasks. Fast, responsive, and distraction-free. No sign-up required.",
  keywords: ["Sreekar Reddy", "Sreekar Reddy Edulapalli", "Sreekar Reddy Portfolio", "Sreekar Reddy Projects", "Todo List", "Minimalist", "Productivity", "React", "Next.js"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://todo.sreekarreddy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://todo.sreekarreddy.com",
    title: "Minimal Todo by Sreekar Reddy",
    description:
      "Clean, minimalist todo app. Fast and distraction-free. Created by Sreekar Reddy.",
    siteName: "Minimal Todo by Sreekar Reddy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimal Todo by Sreekar Reddy",
    description: "Clean, minimalist todo app. Fast and distraction-free.",
    creator: "@esreekarreddy",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}


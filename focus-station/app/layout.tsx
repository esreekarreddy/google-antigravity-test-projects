import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// JSON-LD structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Focus Station",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web Browser",
      "description": "Boost your productivity with a beautiful Pomodoro timer featuring ambient sounds and distraction-free dark UI.",
      "url": "https://focus-station.sreekarreddy.com",
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
        "Pomodoro timer with hexagonal display",
        "Ambient sounds: Rain, Cafe, White Noise",
        "Work, Short Break, Long Break modes",
        "Distraction-free dark UI"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://focus-station.sreekarreddy.com",
      "name": "Focus Station by Sreekar Reddy",
      "description": "Pomodoro timer with ambient sounds and distraction-free interface.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sreekar Reddy Projects",
        "url": "https://sreekarreddy.com"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "Focus Station by Sreekar Reddy - Pomodoro Timer with Ambient Sounds",
  description: "Focus Station by Sreekar Reddy - Boost your productivity with a beautiful Pomodoro timer featuring ambient sounds (rain, cafe, white noise), hexagonal timer display, and distraction-free dark UI.",
  keywords: ["Sreekar Reddy", "Sreekar Reddy Edulapalli", "Sreekar Reddy Portfolio", "Sreekar Reddy Projects", "Focus Station", "Pomodoro", "Productivity", "Ambient Sounds", "Web Audio API"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://focus-station.sreekarreddy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://focus-station.sreekarreddy.com",
    title: "Focus Station by Sreekar Reddy - Pomodoro Timer",
    description: "Boost productivity with ambient sounds and a beautiful hexagonal timer. Created by Sreekar Reddy.",
    siteName: "Focus Station by Sreekar Reddy",
    images: ["/favicon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Station by Sreekar Reddy - Pomodoro Timer",
    description: "Boost productivity with ambient sounds and a beautiful hexagonal timer.",
    images: ["/favicon.svg"],
    creator: "@esreekarreddy",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


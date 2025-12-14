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

export const metadata: Metadata = {
  title: "Focus Station by Sreekar Reddy - Pomodoro Timer with Ambient Sounds",
  description: "Focus Station by Sreekar Reddy - Boost your productivity with a beautiful Pomodoro timer featuring ambient sounds (rain, cafe, white noise), hexagonal timer display, and distraction-free dark UI.",
  keywords: ["Sreekar Reddy", "Sreekar Edulapalli", "sreekarreddy.com", "Sreekar Reddy portfolio", "Sreekar Reddy pomodoro", "Sreekar Reddy focus timer", "Sreekar Reddy projects", "pomodoro timer", "focus timer", "productivity app", "ambient sounds", "deep work"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://sreekarreddy.com/projects/focus-station"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://sreekarreddy.com/projects/focus-station",
    title: "Focus Station by Sreekar Reddy - Pomodoro Timer",
    description: "Boost productivity with ambient sounds and a beautiful hexagonal timer. Created by Sreekar Reddy.",
    siteName: "Focus Station by Sreekar Reddy",
    images: ["/projects/focus-station/favicon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Station by Sreekar Reddy - Pomodoro Timer",
    description: "Boost productivity with ambient sounds and a beautiful hexagonal timer.",
    images: ["/projects/focus-station/favicon.svg"],
  },
  icons: {
    icon: "/projects/focus-station/favicon.svg",
    apple: "/projects/focus-station/favicon.svg",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

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
  title: "Focus Station - Pomodoro Timer with Ambient Sounds",
  description: "Boost your productivity with Focus Station - a beautiful Pomodoro timer featuring ambient sounds (rain, cafe, white noise), hexagonal timer display, and distraction-free dark UI for deep work sessions.",
  keywords: ["pomodoro timer", "focus timer", "productivity app", "ambient sounds", "deep work", "study timer", "Sreekar Reddy"],
  authors: [{ name: "Sreekar Reddy" }],
  creator: "Sreekar Reddy",
  metadataBase: new URL("https://focus-station.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://focus-station.vercel.app",
    title: "Focus Station - Pomodoro Timer with Ambient Sounds",
    description: "Boost productivity with ambient sounds and a beautiful hexagonal timer.",
    siteName: "Focus Station",
    images: ["/favicon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Station - Pomodoro Timer with Ambient Sounds",
    description: "Boost productivity with ambient sounds and a beautiful hexagonal timer.",
    images: ["/favicon.svg"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

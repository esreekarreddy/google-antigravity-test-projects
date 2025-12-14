import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { WarpBackground } from "@/components/layout/warp-background";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SR ZapShare | Secure P2P File Transfer",
  description: "Share files directly between devices with cosmic speed. No cloud, no limits, just warp.",
  keywords: ["Sreekar Reddy", "Sreekar Edulapalli", "sreekarreddy.com", "Sreekar Reddy portfolio", "P2P file transfer", "secure file sharing", "webrtc", "warp share", "no cloud"],
  authors: [{ name: "Sreekar Reddy", url: "https://github.com/esreekarreddy" }],
  creator: "Sreekar Reddy",
  metadataBase: new URL("https://sreekarreddy.com/projects/zapshare"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://sreekarreddy.com/projects/zapshare",
    title: "SR ZapShare | Secure P2P File Transfer",
    description: "Share files directly between devices with cosmic speed. No cloud, no limits, just warp. Powered by WebRTC.",
    siteName: "SR ZapShare",
    images: ["/projects/zapshare/icon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SR ZapShare | Secure P2P File Transfer",
    description: "Share files directly between devices with cosmic speed.",
    images: ["/projects/zapshare/icon.svg"],
  },
  icons: {
    icon: "/projects/zapshare/icon.svg",
    apple: "/projects/zapshare/icon.svg",
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
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased min-h-screen relative overflow-x-hidden bg-background`}
      >
        <WarpBackground />
        <main className="relative z-10 w-full min-h-screen flex flex-col overflow-x-hidden">
          {children}
        </main>
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}

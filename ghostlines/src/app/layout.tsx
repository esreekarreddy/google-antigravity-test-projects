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
  title: "GhostLine | Zero-Server P2P Video",
  description: "End-to-End Encrypted. Host-Proof. Privacy-First Video Calling. No servers, just code.",
  keywords: ["Sreekar Reddy ghostline", "Sreekar Edulapalli", "sreekarreddy.com", "Sreekar Reddy portfolio", "p2p video call", "webrtc video", "privacy app", "end-to-end encryption", "zero knowledge", "secure calling", "nextjs webrtc"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://sreekarreddy.com/projects/ghostline"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://sreekarreddy.com/projects/ghostline",
    title: "GhostLine | Zero-Server P2P Video",
    description: "End-to-End Encrypted. Host-Proof. Privacy-First Video Calling.",
    siteName: "GhostLine by Sreekar Reddy",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostLine | Zero-Server P2P Video",
    description: "End-to-End Encrypted. Host-Proof. Privacy-First Video Calling.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
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

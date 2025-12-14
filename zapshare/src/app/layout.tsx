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

// JSON-LD structured data for rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "SR ZapShare",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "description": "Secure P2P file transfer via WebRTC. Share files directly between devices with no cloud storage.",
      "url": "https://zapshare.sreekarreddy.com",
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
        "Direct P2P file transfer via WebRTC",
        "End-to-end DTLS/SRTP encryption",
        "SHA-256 file integrity verification",
        "No cloud storage - files never leave your device",
        "Human-readable transfer codes"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://zapshare.sreekarreddy.com",
      "name": "SR ZapShare by Sreekar Reddy",
      "description": "Secure P2P file transfer with no cloud storage. Built by Sreekar Reddy.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sreekar Reddy Projects",
        "url": "https://sreekarreddy.com"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "SR ZapShare by Sreekar Reddy | Secure P2P File Transfer",
  description: "SR ZapShare by Sreekar Reddy - Share files directly between devices with cosmic speed. No cloud, no limits, just warp. Powered by WebRTC.",
  keywords: ["Sreekar Reddy", "Sreekar Reddy Edulapalli", "Sreekar Reddy Portfolio", "Sreekar Reddy Projects", "ZapShare", "File Transfer", "P2P", "WebRTC", "Privacy", "P2P file transfer", "secure file sharing", "webrtc", "warp share", "no cloud"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://zapshare.sreekarreddy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://zapshare.sreekarreddy.com",
    title: "SR ZapShare by Sreekar Reddy | Secure P2P File Transfer",
    description: "Share files directly between devices with cosmic speed. No cloud, no limits, just warp. Powered by WebRTC.",
    siteName: "SR ZapShare by Sreekar Reddy",
    images: ["/icon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SR ZapShare by Sreekar Reddy | Secure P2P File Transfer",
    description: "Share files directly between devices with cosmic speed.",
    images: ["/icon.svg"],
    creator: "@esreekarreddy",
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


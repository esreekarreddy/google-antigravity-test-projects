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
      "name": "GhostLine",
      "applicationCategory": "CommunicationApplication",
      "operatingSystem": "Web Browser",
      "description": "Zero-server, end-to-end encrypted P2P video calling. Privacy-first with ephemeral ghost codes.",
      "url": "https://ghostline.sreekarreddy.com",
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
        "Zero-server architecture",
        "End-to-end WebRTC encryption (DTLS-SRTP)",
        "Ephemeral ghost codes (auto-rotate)",
        "Visual security verification",
        "Screen sharing"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://ghostline.sreekarreddy.com",
      "name": "GhostLine by Sreekar Reddy",
      "description": "Privacy-first P2P video calling with end-to-end encryption.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Sreekar Reddy Projects",
        "url": "https://sreekarreddy.com"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "GhostLine by Sreekar Reddy | Zero-Server P2P Video",
  description: "GhostLine by Sreekar Reddy - End-to-End Encrypted. Host-Proof. Privacy-First Video Calling. No servers, just code.",
  keywords: ["Sreekar Reddy", "Sreekar Reddy Edulapalli", "Sreekar Reddy Portfolio", "Sreekar Reddy Projects", "GhostLine", "Video Call", "P2P", "WebRTC", "Privacy", "Secure", "end-to-end encryption", "zero knowledge", "secure calling", "nextjs webrtc"],
  authors: [{ name: "Sreekar Reddy", url: "https://sreekarreddy.com" }],
  creator: "Sreekar Reddy",
  publisher: "Sreekar Reddy",
  metadataBase: new URL("https://ghostline.sreekarreddy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://ghostline.sreekarreddy.com",
    title: "GhostLine by Sreekar Reddy | Zero-Server P2P Video",
    description: "End-to-End Encrypted. Host-Proof. Privacy-First Video Calling.",
    siteName: "GhostLine by Sreekar Reddy",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostLine by Sreekar Reddy | Zero-Server P2P Video",
    description: "End-to-End Encrypted. Host-Proof. Privacy-First Video Calling.",
    images: ["/icon.png"],
    creator: "@esreekarreddy",
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


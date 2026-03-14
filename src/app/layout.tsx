import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeProof - Prove Your Code Ownership on the Blockchain",
  description:
    "Register your code on the Polygon blockchain and get an immutable proof of authorship. Verifiable by anyone, anytime. Free to start.",
  keywords: [
    "blockchain",
    "code ownership",
    "proof of authorship",
    "polygon",
    "developer tools",
    "SHA-256",
    "smart contract",
  ],
  openGraph: {
    title: "CodeProof - Prove Your Code Ownership on the Blockchain",
    description:
      "Register your code on the Polygon blockchain and get an immutable proof of authorship. Verifiable by anyone, anytime.",
    url: "https://codeproof.net",
    siteName: "CodeProof",
    images: [
      {
        url: "https://codeproof.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeProof - Blockchain Code Ownership",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeProof - Prove Your Code Ownership on the Blockchain",
    description:
      "Register your code on the Polygon blockchain and get an immutable proof of authorship.",
    images: ["https://codeproof.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://codeproof.net",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100`}
      >
        <Navbar />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}

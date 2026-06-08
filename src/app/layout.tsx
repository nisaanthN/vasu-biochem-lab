import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BioPharm Lab — AI Biochemistry Learning & Virtual Laboratory · SVCP",
    template: "%s · BioPharm Lab",
  },
  description:
    "AI-Based Biochemistry Learning and Virtual Laboratory Platform for Pharmacy Students, aligned with PCI B.Pharm BP203T syllabus. Developed by Durga Bhavani, Assistant Professor, Shri Vishnu College of Pharmacy (Autonomous). Offline-first, free, and open.",
  keywords: ["biochemistry", "pharmacy", "B.Pharm", "BP203T", "virtual lab", "spaced repetition", "Shri Vishnu College of Pharmacy", "SVCP", "Durga Bhavani"],
  authors: [{ name: "Durga Bhavani" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

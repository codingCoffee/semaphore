import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import { StorageProvider } from "@/providers/StorageProvider";
import { ZeroInit } from "@/components/zero-init";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import GSAPCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGroteskSans = Space_Grotesk({
  variable: "--font-spacegrotesk-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semaphore",
  description: "The simplest, no nonsense AI chat app!",
  keywords: ["AI", "Chat", "LLM"],
  authors: [{ name: "Ameya Shenoy", url: "https://codingcoffee.dev" }],
  creator: "Ameya Shenoy",
  publisher: "Ameya Shenoy",
  metadataBase: new URL("https://semaphore.chat"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: "/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semaphore",
    description: "The simplest, no nonsense AI chat app!",
    creator: "@codingcoffeeX",
    creatorId: "523264272",
    images: ["https://semaphore.chat/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGroteskSans.variable} ${spaceMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen selection:bg-red-200 dark:selection:bg-red-900">
            <SessionProvider>
              <StorageProvider>
                <ZeroInit>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 fixed z-20">
                        <div className="flex items-center gap-2 px-2 rounded-md backdrop-blur-3xl">
                          <SidebarTrigger />
                          <ModeToggle />
                        </div>
                      </header>
                      {children}
                    </SidebarInset>
                  </SidebarProvider>
                </ZeroInit>
              </StorageProvider>
            </SessionProvider>
            <footer className="flex"></footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

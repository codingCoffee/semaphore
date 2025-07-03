import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { Icon } from "@iconify/react";
import { StorageProvider } from "@/providers/StorageProvider";
import { ZeroInit } from "@/components/zero-init";
import { SessionProvider } from "@/components/session-provider";
import { Geist, Geist_Mono, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CookiesProviderWrapper from "@/components/cookies-provider";

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
  title: {
    template: "%s",
    default: "Semaphore",
  },
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
    title: "Semaphore",
    description: "The simplest, no nonsense AI chat app!",
    url: "https://semaphore.chat",
    siteName: "Semaphore",
    images: [
      {
        url: "https://nextjs.org/og-image.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://nextjs.org/og-image.png",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen selection:bg-red-200 dark:selection:bg-red-900">
            <CookiesProviderWrapper>
              <SessionProvider>
                <StorageProvider>
                  <ZeroInit>
                    <SidebarProvider>
                      <AppSidebar />
                      <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 fixed z-20">
                          <div className="flex items-center gap-2 px-2 rounded-md backdrop-blur-3xl">
                            <SidebarTrigger />

                            <ModeToggle />

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href="https://github.com/codingcoffee/semaphore">
                                  <Icon icon="line-md:github-loop" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Star me on GitHub</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </header>
                        {children}
                      </SidebarInset>
                    </SidebarProvider>
                  </ZeroInit>
                </StorageProvider>
              </SessionProvider>
            </CookiesProviderWrapper>
            <footer className="flex"></footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"
const geistSans = localFont({
  src: "./fonts/Lato-Regular.ttf",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Hassle | Modern Real Estate Platform",
  description: "Find your dream property without the hassle",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", geistSans.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  )
}

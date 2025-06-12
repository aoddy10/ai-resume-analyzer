import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppThemeProvider } from "@/components/theme-provider";
import { ThemeToggleButton } from "@/components/Theme-toggle-button";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "AI Resume Analyzer",
    description:
        "Get AI-powered feedback and job match score from your resume.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
            >
                <AppThemeProvider>
                    <div className="min-h-screen flex flex-col">
                        <div className="flex justify-end p-4">
                            <ThemeToggleButton />
                        </div>
                        <main className="flex-1 w-full px-4 sm:px-6 md:px-8">
                            {children}
                        </main>
                        <Toaster />
                    </div>
                </AppThemeProvider>
            </body>
        </html>
    );
}

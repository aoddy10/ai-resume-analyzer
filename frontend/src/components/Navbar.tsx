"use client";

import Link from "next/link";
import { ThemeToggleButton } from "@/components/Theme-toggle-button";

export default function Navbar() {
    return (
        <nav className="bg-muted text-foreground px-4 py-2 shadow-md dark:bg-gray-900">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="font-bold text-lg">
                    AI Resume Analyzer
                </Link>
                <div className="flex gap-4 text-sm items-center">
                    <Link href="/analyzer">Resume Analyzer</Link>
                    <Link href="/analyzer-history">JD Matcher History</Link>
                    <ThemeToggleButton />
                </div>
            </div>
        </nav>
    );
}

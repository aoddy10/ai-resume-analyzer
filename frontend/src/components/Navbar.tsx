"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "@/components/Theme-toggle-button";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-muted text-foreground px-4 py-2 shadow-md dark:bg-gray-900">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="font-bold text-lg">
                    AI Resume Analyzer
                </Link>
                <div className="flex gap-4 text-sm items-center">
                    <Link href="/" passHref>
                        <Button
                            variant={pathname === "/" ? "default" : "ghost"}
                            className="text-sm font-normal hover:cursor-pointer"
                        >
                            Home
                        </Button>
                    </Link>
                    <Link href="/analyzer" passHref>
                        <Button
                            variant={
                                pathname === "/analyzer" ? "default" : "ghost"
                            }
                            className="text-sm font-normal hover:cursor-pointer"
                        >
                            Resume Analyzer
                        </Button>
                    </Link>
                    <Link href="/analyzer-history" passHref>
                        <Button
                            variant={
                                pathname === "/analyzer-history"
                                    ? "default"
                                    : "ghost"
                            }
                            className="text-sm font-normal hover:cursor-pointer"
                        >
                            JD Matcher History
                        </Button>
                    </Link>
                    <ThemeToggleButton />
                </div>
            </div>
        </nav>
    );
}

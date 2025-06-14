"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "@/components/Theme-toggle-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-muted text-foreground px-4 py-2 shadow-md dark:bg-gray-900">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="font-bold text-lg">
                    AI Resume Analyzer
                </Link>
                <div className="sm:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-foreground focus:outline-none"
                        aria-label="Toggle navigation"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="hidden sm:flex gap-4 text-sm items-center">
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
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-muted shadow-lg p-4 flex flex-col gap-4 text-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Link href="/" passHref>
                            <Button
                                variant={pathname === "/" ? "default" : "ghost"}
                                className="text-sm font-normal"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Button>
                        </Link>
                        <Link href="/analyzer" passHref>
                            <Button
                                variant={
                                    pathname === "/analyzer"
                                        ? "default"
                                        : "ghost"
                                }
                                className="text-sm font-normal"
                                onClick={() => setIsOpen(false)}
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
                                className="text-sm font-normal"
                                onClick={() => setIsOpen(false)}
                            >
                                JD Matcher History
                            </Button>
                        </Link>
                        <ThemeToggleButton />
                    </div>
                </div>
            )}
        </nav>
    );
}

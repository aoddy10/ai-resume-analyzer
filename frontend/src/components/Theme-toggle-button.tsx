"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <button
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}

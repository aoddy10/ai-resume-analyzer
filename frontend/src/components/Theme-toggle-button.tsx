"use client";

import { useTheme } from "next-themes";

export function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            Toggle {theme === "dark" ? "Light" : "Dark"}
        </button>
    );
}

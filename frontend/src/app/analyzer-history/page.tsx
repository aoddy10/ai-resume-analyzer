"use client";

import { useEffect, useState } from "react";
import { useHistoryStore, ResumeHistoryItem } from "@/hooks/useHistoryStore";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AnalyzerHistoryPage() {
    const { getHistory, clearHistory } = useHistoryStore();
    const [history, setHistory] = useState<ResumeHistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, [getHistory]);

    const handleView = (item: ResumeHistoryItem) => {
        alert(`Viewing: ${item.filename}`);
    };

    const handleReanalyze = (item: ResumeHistoryItem) => {
        alert(`Re-analyzing: ${item.filename}`);
    };

    const handleDelete = (id: string) => {
        const updated = history.filter((item) => item.id !== id);
        localStorage.setItem("resume_history", JSON.stringify(updated));
        setHistory(updated);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4 dark:text-white">
                Resume Analysis History
            </h1>
            {history.length === 0 ? (
                <p className="text-muted-foreground">No history found.</p>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="border p-4 rounded-md shadow-sm bg-card text-card-foreground"
                        >
                            <div className="flex justify-between flex-wrap gap-2 items-center">
                                <div>
                                    <p className="font-medium">
                                        {item.filename}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(
                                            new Date(item.timestamp),
                                            "PPpp"
                                        )}
                                    </p>
                                    <p className="text-sm">
                                        Match Score:{" "}
                                        <span
                                            className={
                                                item.matchScore >= 70
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {item.matchScore.toFixed(2)}%
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleView(item)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleReanalyze(item)}
                                    >
                                        Re-analyze
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

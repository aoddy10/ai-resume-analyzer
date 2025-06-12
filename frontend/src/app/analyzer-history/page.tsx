"use client";

import { useEffect, useState } from "react";
import { useHistoryStore, ResumeHistoryItem } from "@/store/useHistoryStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
                                    <p className="text-sm mt-2">
                                        Match Score:{" "}
                                        <Badge
                                            className={`ml-2 ${
                                                item.matchScore >= 70
                                                    ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"
                                            }`}
                                        >
                                            {item.matchScore.toFixed(2)}%
                                        </Badge>
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4 sm:mt-0">
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
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Confirm Deletion
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to
                                                    delete this history item?
                                                    This action cannot be
                                                    undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

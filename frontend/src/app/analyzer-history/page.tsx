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
import JDMatcherViewDialog from "@/components/JDMatcherViewDialog";
import ExportButton from "@/components/ExportButton";

export default function AnalyzerHistoryPage() {
    const { getHistory, clearHistory } = useHistoryStore();
    const [history, setHistory] = useState<ResumeHistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, [getHistory]);

    useEffect(() => {
        if (history.length > 0) {
            console.log(history[0]);
            console.log(typeof history[0].gptFeedback);
        }
    }, [history]);

    const handleDelete = (id: string) => {
        const updated = history.filter((item) => item.id !== id);
        localStorage.setItem("resume_history", JSON.stringify(updated));
        setHistory(updated);
    };

    return (
        <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
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
                            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
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
                                {(() => {
                                    let gptFeedbackObj = null;
                                    let gapFeedbackObj = null;

                                    try {
                                        gptFeedbackObj =
                                            typeof item.gptFeedback === "string"
                                                ? JSON.parse(item.gptFeedback)
                                                : item.gptFeedback;
                                        gapFeedbackObj =
                                            typeof item.gapFeedback === "string"
                                                ? JSON.parse(item.gapFeedback)
                                                : item.gapFeedback;
                                    } catch (e) {
                                        console.error(
                                            "Failed to parse feedback:",
                                            e
                                        );
                                    }

                                    return (
                                        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                                            {gptFeedbackObj ||
                                            gapFeedbackObj ? (
                                                <JDMatcherViewDialog
                                                    item={{
                                                        ...item,
                                                        gptFeedback:
                                                            gptFeedbackObj,
                                                        gapFeedback:
                                                            gapFeedbackObj,
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">
                                                    No feedback data available.
                                                </p>
                                            )}

                                            {gptFeedbackObj &&
                                                gapFeedbackObj &&
                                                item.matchScore && (
                                                    <div className="my-1 sm:my-0 sm:mx-1">
                                                        <ExportButton
                                                            resumeFeedback={
                                                                gptFeedbackObj
                                                            }
                                                            jdMatchFeedback={
                                                                gapFeedbackObj
                                                            }
                                                            matchScore={
                                                                item.matchScore
                                                            }
                                                        />
                                                    </div>
                                                )}

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
                                                            Are you sure you
                                                            want to delete this
                                                            history item? This
                                                            action cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            className="bg-red-600 hover:bg-red-700 text-white"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

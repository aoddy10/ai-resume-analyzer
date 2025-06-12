"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResumeHistoryItem } from "@/store/useHistoryStore";

export default function JDMatcherViewDialog({
    item,
}: {
    item: ResumeHistoryItem;
}) {
    const [open, setOpen] = useState(false);
    const { filename, timestamp, matchScore, gapFeedback, gptFeedback } = item;

    const parsedGptFeedback =
        typeof gptFeedback === "string" ? JSON.parse(gptFeedback) : gptFeedback;
    const parsedGapFeedback =
        typeof gapFeedback === "string" ? JSON.parse(gapFeedback) : gapFeedback;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">View</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{filename}</DialogTitle>
                    <DialogDescription>
                        {format(new Date(timestamp), "PPpp")}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <p className="font-medium">
                        Match Score:{" "}
                        <Badge
                            className={
                                matchScore >= 70
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white" + " ml-2"
                            }
                        >
                            {matchScore.toFixed(2)}%
                        </Badge>
                    </p>

                    <section className="mt-4 space-y-3">
                        <div>
                            <h3 className="font-semibold">Strengths:</h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {parsedGptFeedback?.strengths?.map(
                                    (s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Areas for Improvement:
                            </h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {parsedGptFeedback?.areas_for_improvement?.map(
                                    (a: string, i: number) => (
                                        <li key={i}>{a}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Missing Information:
                            </h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {parsedGptFeedback?.missing_information?.map(
                                    (m: string, i: number) => (
                                        <li key={i}>{m}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mt-4">
                                Gap Feedback:
                            </h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {parsedGapFeedback?.suggestions?.map(
                                    (g: string, i: number) => (
                                        <li key={i}>{g}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}

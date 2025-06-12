"use client";

import React, { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import JDMatcher from "@/components/JDMatcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";
import ExportButton from "@/components/ExportButton";

export default function ResumeAnalyzerPage() {
    const [step, setStep] = useState(1);
    const [resumeText, setResumeText] = useState<string>("");
    const [gptFeedback, setGptFeedback] = useState<object>({}); // Update type to object
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [gapFeedback, setGapFeedback] = useState<object>({}); // Update type to string[]

    const handleResumeSuccess = (text: string, feedback: object) => {
        setResumeText(text);
        setGptFeedback(feedback);
    };

    const handleJDMatcherSuccess = (
        gap_feedback: object,
        score: number | null
    ) => {
        setGapFeedback(gap_feedback);
        setMatchScore(score);
    };

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 space-y-6 dark:bg-background dark:text-foreground">
            <div className="mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
            <Card className="bg-white dark:bg-card text-black dark:text-card-foreground">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                        <FileText className="text-blue-500" /> Step {step} of 2
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div>
                            <ResumeUpload
                                onUploadSuccess={handleResumeSuccess}
                            />

                            {Object.keys(gptFeedback).length > 0 && (
                                <Button
                                    className="mt-4"
                                    onClick={() => setStep(2)}
                                    disabled={!resumeText}
                                >
                                    Go to next step: JD Matcher
                                </Button>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">
                                    Resume Uploaded & Analyzed
                                </h3>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">
                                    Your resume has been successfully uploaded
                                    and analyzed by GPT. You can now match it
                                    against a Job Description.
                                </p>
                            </div>
                            <Separator className="my-4" />
                            <JDMatcher
                                resumeText={resumeText}
                                onJDMatcherSuccess={handleJDMatcherSuccess} // Pass handleJDMatcherSuccess to JDMatcher
                            />

                            <div className="flex flex-col sm:flow-row gap-3 justify-between items-center mt-6">
                                {matchScore !== null && (
                                    <ExportButton
                                        resumeFeedback={gptFeedback}
                                        jdMatchFeedback={gapFeedback}
                                        matchScore={matchScore}
                                    />
                                )}
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="secondary"
                                    className="dark:bg-muted dark:text-white"
                                >
                                    <ChevronLeft className="mr-2" />
                                    Back to Step 1
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}

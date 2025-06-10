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
    const [gptFeedback, setGptFeedback] = useState<string>("");
    const [matchScore, setMatchScore] = useState<number | null>(null);

    const handleResumeSuccess = (text: string, feedback: string) => {
        setResumeText(text);
        setGptFeedback(feedback);
    };

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            <div className="mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="text-blue-500" /> Step {step} of 2
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div>
                            <ResumeUpload
                                onUploadSuccess={handleResumeSuccess}
                            />

                            {gptFeedback && (
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
                                <p className="text-sm text-muted-foreground">
                                    Your resume has been successfully uploaded
                                    and analyzed by GPT. You can now match it
                                    against a Job Description.
                                </p>
                            </div>
                            <Separator className="my-4" />
                            <JDMatcher
                                resumeText={resumeText}
                                onMatchScore={setMatchScore}
                            />
                            {matchScore !== null && (
                                <div className="mt-6">
                                    <ExportButton
                                        feedback={gptFeedback}
                                        matchScore={matchScore}
                                    />
                                </div>
                            )}
                            <div className="mt-6 text-right">
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="secondary"
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

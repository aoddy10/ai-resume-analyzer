"use client";

import React, { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import JDMatcher from "@/components/JDMatcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

export default function ResumeAnalyzerPage() {
    const [step, setStep] = useState(1);
    const [resumeText, setResumeText] = useState<string>("");
    const [gptFeedback, setGptFeedback] = useState<string>("");

    const handleResumeSuccess = (text: string, feedback: string) => {
        setResumeText(text);
        setGptFeedback(feedback);
    };

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
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
                                <div>
                                    <Card className="mt-6">
                                        <CardHeader>
                                            <CardTitle>
                                                Previous Feedback
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {gptFeedback}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Button
                                        className="mt-4"
                                        onClick={() => setStep(2)}
                                        disabled={!resumeText}
                                    >
                                        Go to next step: JD Matcher
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">
                                    ✅ Resume Uploaded & Analyzed
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {gptFeedback.substring(0, 200)}...
                                </p>
                            </div>
                            <Separator className="my-4" />
                            <JDMatcher resumeText={resumeText} />
                            <div className="mt-6 text-right">
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="secondary"
                                >
                                    ⬅️ Back to Step 1
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}

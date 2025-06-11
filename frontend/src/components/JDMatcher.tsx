"use client";

import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { matchJDWithResume } from "@/api/match";
import useAxios from "@/hooks/useAxios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";

interface JDMatcherProps {
    resumeText: string;
    onJDMatcherSuccess?: (feedback: object, score: number | null) => void; // Update feedback to object
}

const JDMatcher: React.FC<JDMatcherProps> = ({
    resumeText,
    onJDMatcherSuccess,
}) => {
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [gapFeedback, setGapFeedback] = useState<object | null>(null); // Update type to object | null
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const axiosInstance = useAxios();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setJdFile(file);
        setErrorText("");
    };

    const handleMatch = async () => {
        if (!jdFile) {
            setErrorText("Please select a Job Description PDF");
            return;
        }

        setLoading(true);
        setErrorText("");

        try {
            const result = await matchJDWithResume(axiosInstance, {
                jdFile,
                resumeText,
            }); // Pass as object
            const feedbackObject = { suggestions: result.suggestions }; // Convert to object

            setGapFeedback(feedbackObject);
            setMatchScore(result.match_score);

            if (onJDMatcherSuccess) {
                onJDMatcherSuccess(feedbackObject, result.match_score); // Pass as object
            }
        } catch (error) {
            console.error("Error in JDMatcher", error);
            toast.error(
                "An error occurred while processing the job description."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto mt-10">
            <CardHeader>
                <CardTitle>Step 3: Match with Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Upload Job Description (JD)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Label htmlFor="jd-file-input">Select JD PDF</Label>
                            <Input
                                id="jd-file-input"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                data-testid="jd-file-input"
                            />
                            {errorText && (
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {errorText}
                                </p>
                            )}

                            <Button onClick={handleMatch} disabled={loading}>
                                Analyze Match
                            </Button>

                            {loading && (
                                <div
                                    className="space-y-3 mt-6"
                                    data-testid="loading-indicator"
                                >
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            )}

                            <Transition
                                show={!loading && matchScore !== null}
                                enter="transition-opacity duration-700"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div>
                                    <hr className="my-6 border-gray-300" />
                                    <Card className="bg-green-50 border-green-200">
                                        <CardHeader>
                                            <CardTitle className="text-green-700 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                Match Score: {matchScore}%
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-gray-700">
                                            <strong>GAP Feedback:</strong>
                                            <p className="whitespace-pre-wrap mt-1">
                                                {typeof gapFeedback === "object"
                                                    ? JSON.stringify(
                                                          gapFeedback
                                                      )
                                                    : gapFeedback || "None"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Transition>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default JDMatcher;

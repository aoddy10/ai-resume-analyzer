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
    onJDMatcherSuccess?: (gap_feedback: object, score: number | null) => void; // Update feedback to string[]
}

const JDMatcher: React.FC<JDMatcherProps> = ({
    resumeText,
    onJDMatcherSuccess,
}) => {
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [gapFeedback, setGapFeedback] = useState<string[]>([]); // Update type to string[]
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

            // Use optional chaining and fallback to empty array
            const suggestionsArray = result?.gap_feedback?.suggestions || [];

            setGapFeedback(suggestionsArray);
            setMatchScore(result?.match_score);

            if (onJDMatcherSuccess) {
                onJDMatcherSuccess(result?.gap_feedback, result?.match_score); // Pass as string[]
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
        <Card className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <CardHeader>
                <CardTitle>Step 3: Match with Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-4">
                <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            Upload Job Description (JD)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Label
                                htmlFor="jd-file-input"
                                className="dark:text-gray-300"
                            >
                                Select JD PDF
                            </Label>
                            <Input
                                id="jd-file-input"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                data-testid="jd-file-input"
                                className="dark:bg-gray-700 dark:text-gray-100"
                            />
                            {errorText && (
                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
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
                                    <hr className="my-6 border-gray-300 dark:border-gray-700" />
                                    <Card className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
                                        <CardHeader>
                                            <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                Match Score: {matchScore}%
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>GAP Feedback:</strong>
                                            {gapFeedback.length > 0 ? (
                                                <ul className="list-disc list-inside mt-1">
                                                    {gapFeedback.map(
                                                        (suggestion, index) => (
                                                            <li
                                                                key={index}
                                                                className="mt-2"
                                                            >
                                                                {suggestion}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                    None
                                                </p>
                                            )}
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

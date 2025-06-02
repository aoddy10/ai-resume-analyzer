"use client";

import React, { useState } from "react";
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
}

const JDMatcher: React.FC<JDMatcherProps> = ({ resumeText }) => {
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [gapFeedback, setGapFeedback] = useState<string | null>(null);
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

        try {
            setLoading(true);
            const result = await matchJDWithResume(axiosInstance, {
                jdFile,
                resumeText,
            });
            setMatchScore(result.match_score);
            setGapFeedback(result.suggestions);
        } catch (error) {
            toast("Upload Failed", {
                description: "Error analyzing job description",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto mt-10">
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

                    {!loading && matchScore !== null && (
                        <div
                            className="mt-6 p-4 border rounded bg-green-50"
                            data-testid="match-result"
                        >
                            <p className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Match Score:{" "}
                                <span className="text-green-700">
                                    {matchScore}%
                                </span>
                            </p>
                            <div className="mt-2 text-sm text-gray-700">
                                <strong>GAP Feedback:</strong>
                                <p className="whitespace-pre-wrap mt-1">
                                    {gapFeedback || "None"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default JDMatcher;

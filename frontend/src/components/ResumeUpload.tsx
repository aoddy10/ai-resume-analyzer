"use client";

import React, { useState, useRef, useEffect } from "react";
import { uploadResume } from "@/api/upload";
import useAxios from "@/hooks/useAxios";
import { AxiosProgressEvent } from "axios";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

type FeedbackDataProps = {
    filename: string;
    resume_text: string;
    gpt_feedback: string;
};

interface ResumeUploadProps {
    onUploadSuccess?: (resumeText: string, gptFeedback: string) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
    const axiosInstance = useAxios();
    const [file, setFile] = useState<File | null>(null);
    const [errorText, setErrorText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [feedbackData, setFeedbackData] = useState<FeedbackDataProps | null>(
        null
    );

    // Scroll to feedback card when gpt_feedback is available
    useEffect(() => {
        if (feedbackData && feedbackData.gpt_feedback) {
            const el = document.getElementById("gpt_feedback");
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [feedbackData]);

    const formRef = useRef<HTMLFormElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setErrorText("");
            setPdfUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setErrorText("");
            setPdfUrl(URL.createObjectURL(e.dataTransfer.files[0]));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragEnter = () => {
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setErrorText("Please select a PDF file");
            return;
        }
        setIsLoading(true);
        setProgress(0);
        setFeedbackData(null);
        try {
            const result = await uploadResume(axiosInstance, {
                file,
                onUploadProgress: (event: AxiosProgressEvent) => {
                    if (event.total && event.total > 0) {
                        const percent = Math.round(
                            (event.loaded * 100) / event.total
                        );
                        setProgress(percent);
                    }
                },
            });
            if (result) {
                setFeedbackData(result);
                if (onUploadSuccess) {
                    onUploadSuccess(result.resume_text, result.gpt_feedback);
                }
            } else {
                throw new Error("Parsing failed");
            }
        } catch (error) {
            setErrorText("Upload failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="w-full py-20 md:py-28 bg-gray-50">
            <div className="container mx-auto max-w-screen-md px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
                    Upload Your Resume
                </h2>
                <div
                    ref={dropRef}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    data-testid="drop-zone"
                    className={`p-4 border-2 border-dashed rounded-lg ${
                        dragActive
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300"
                    }`}
                >
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 items-start"
                    >
                        <Label>Please select a PDF file</Label>

                        <Input
                            data-testid="file-input"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />

                        <Button size="lg">Submit</Button>

                        {errorText && (
                            <p className="text-sm text-red-600 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {errorText}
                            </p>
                        )}
                    </form>
                </div>
                {isLoading && (
                    <div
                        className="my-6 space-y-2"
                        data-testid="loading-indicator"
                    >
                        <p
                            className="text-blue-600 flex gap-2"
                            data-testid="loading-indicator"
                        >
                            <svg
                                className="animate-spin h-5 w-5 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                role="status"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            <span>Uploading and waiting for feedback...</span>
                        </p>
                        <Progress value={progress} />
                    </div>
                )}

                {pdfUrl && (
                    <Card
                        id="gpt_feedback"
                        className="mt-6"
                        data-testid="pdf-preview"
                    >
                        <CardHeader>
                            <CardTitle>Resume Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="500px"
                                title="PDF Preview"
                                className="border"
                            ></iframe>
                        </CardContent>
                    </Card>
                )}

                {feedbackData && (
                    <Card className="mt-6" data-testid="parsed-data">
                        <CardHeader>
                            <CardTitle>Resume Analysis Result</CardTitle>
                            <CardDescription>
                                Filename: {feedbackData.filename}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold mb-2">
                                Resume Feedback
                            </h4>
                            <p className="text-sm whitespace-pre-wrap">
                                {feedbackData.gpt_feedback}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}

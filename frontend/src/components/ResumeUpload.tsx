"use client";

import React, { useState, useRef } from "react";
import { uploadResume } from "@/api/upload";
import useAxios from "@/hooks/useAxios";
import { AxiosProgressEvent } from "axios";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [feedbackData, setFeedbackData] = useState<FeedbackDataProps | null>(
        null
    );

    const formRef = useRef<HTMLFormElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage("");
            setPdfUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setMessage("");
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
            setMessage("Please select a PDF file");
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
                setMessage("Upload and analysis completed successfully");
                if (onUploadSuccess) {
                    onUploadSuccess(result.resume_text, result.gpt_feedback);
                }
            } else {
                throw new Error("Parsing failed");
            }
        } catch (error) {
            setMessage("Upload failed");
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

                        {message && (
                            <p
                                className="mt-4 text-sm text-gray-700"
                                data-testid="upload-message"
                            >
                                * {message}
                            </p>
                        )}
                    </form>
                </div>
                {isLoading && (
                    <div className="my-6">
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
                        <Progress value={progress} className="text-blue-600" />
                    </div>
                )}

                {pdfUrl && (
                    <div className="mt-6" data-testid="pdf-preview">
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="500px"
                            title="PDF Preview"
                            className="border"
                        ></iframe>
                    </div>
                )}

                {/* {feedbackData && (
                    <div
                        className="mt-6 bg-white p-4 rounded shadow"
                        data-testid="parsed-data"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            Resume Analysis Result
                        </h3>
                        <p className="text-sm text-gray-800">
                            <strong>Filename:</strong> {feedbackData.filename}
                        </p>

                        <div className="mt-2">
                            <h4 className="font-semibold">AI Feedback</h4>
                            <pre className="text-sm whitespace-pre-wrap">
                                {feedbackData.gpt_feedback}
                            </pre>
                        </div>
                    </div>
                )} */}
            </div>
        </section>
    );
}

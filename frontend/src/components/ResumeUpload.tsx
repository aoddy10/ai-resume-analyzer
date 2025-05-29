"use client";

import React, { useState, useRef } from "react";
import { uploadResume } from "@/api/upload";
import useAxios from "@/hooks/useAxios";
import { AxiosProgressEvent } from "axios";

export default function ResumeUpload() {
    const axiosInstance = useAxios();
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [feedbackData, setFeedbackData] = useState<string>("");

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
        setFeedbackData("");
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

            if (result?.gpt_feedback) {
                const feedbackText = result.gpt_feedback;

                setFeedbackData(feedbackText);
                setMessage("Upload and analysis completed successfully");
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
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <input
                            data-testid="file-input"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-4"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                        {file && !message.includes("Please select") && (
                            <p
                                className="mt-2 text-sm text-gray-900"
                                data-testid="file-name"
                            >
                                {file.name}
                            </p>
                        )}
                        {message && (
                            <p
                                className="mt-4 text-sm text-gray-700"
                                data-testid="upload-message"
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>
                {isLoading && (
                    <p
                        className="text-blue-600"
                        data-testid="loading-indicator"
                    >
                        Uploading...
                    </p>
                )}
                {isLoading && (
                    <div className="w-full mt-4" data-testid="upload-progress">
                        <div className="bg-gray-300 h-2 rounded">
                            <div
                                className="bg-blue-600 h-2 rounded"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-center mt-1">{progress}%</p>
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

                {feedbackData && (
                    <div
                        className="mt-6 bg-white p-4 rounded shadow"
                        data-testid="parsed-data"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            Feedback Resume Data
                        </h3>
                        <pre className="text-sm whitespace-pre-wrap">
                            {feedbackData}
                        </pre>
                    </div>
                )}
            </div>
        </section>
    );
}

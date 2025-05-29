"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage("");
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setMessage("");
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
        try {
            const formData = new FormData();
            formData.append("file", file);

            await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            setMessage(`${file.name} uploaded successfully`);
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
            </div>
        </section>
    );
}

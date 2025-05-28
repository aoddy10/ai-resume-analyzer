// src/components/ResumeUpload.tsx
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumeUpload() {
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("Upload response:", data);
            // TODO: Handle feedback here
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-screen-md mx-auto py-16 px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">
                Upload Your Resume
            </h2>
            <p className="text-muted-foreground mb-8">
                Receive AI feedback in seconds
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <label className="cursor-pointer">
                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <Button variant="outline" disabled={uploading}>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? "Uploading..." : "Select PDF"}
                    </Button>
                </label>

                {fileName && (
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                )}
            </div>
        </div>
    );
}

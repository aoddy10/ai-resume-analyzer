"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportFile } from "@/api/export";
import useAxios from "@/hooks/useAxios";

type ExportButtonProps = {
    feedback: string;
    matchScore: number;
};

export default function ExportButton({
    feedback,
    matchScore,
}: ExportButtonProps) {
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios();

    const handleExport = async (format: "pdf" | "md") => {
        setLoading(true);
        try {
            await exportFile(axiosInstance, { format, feedback, matchScore });

            toast(
                `Download successful: Your ${format.toUpperCase()} file has been downloaded.`
            );
        } catch (err) {
            console.error("Download failed:", err);
            toast(
                "Download failed: An error occurred while downloading the file."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3">
            <Button onClick={() => handleExport("pdf")} disabled={loading}>
                {loading ? "Exporting..." : "Export PDF"}
            </Button>
            <Button onClick={() => handleExport("md")} disabled={loading}>
                {loading ? "Exporting..." : "Export Markdown"}
            </Button>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportFile } from "@/api/export";
import useAxios from "@/hooks/useAxios";

type ExportButtonProps = {
    resumeFeedback: object;
    jdMatchFeedback: object;
    matchScore: number;
};

export default function ExportButton({
    resumeFeedback,
    jdMatchFeedback,
    matchScore,
}: ExportButtonProps) {
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios();

    const handleExport = async (format: "pdf" | "md") => {
        setLoading(true);
        try {
            await exportFile(axiosInstance, {
                format,
                resumeFeedback, // Send raw feedback object
                jdMatchFeedback, // Send raw feedback object
                matchScore,
            });

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
        <div className="flex flex-col sm:flex-row gap-3 dark:text-foreground">
            <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                disabled={loading}
            >
                {loading ? "Exporting..." : "Export PDF"}
            </Button>
            <Button
                variant="outline"
                onClick={() => handleExport("md")}
                disabled={loading}
            >
                {loading ? "Exporting..." : "Export Markdown"}
            </Button>
        </div>
    );
}

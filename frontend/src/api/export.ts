import useAxios from "@/hooks/useAxios";
import type { AxiosProgressEvent } from "axios";

interface ExportFileOptions {
    format: "pdf" | "md";
    resumeFeedback: object; // Allow both string and object
    jdMatchFeedback: object; // Allow both string and object
    matchScore: number;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function exportFile(
    axiosInstance: ReturnType<typeof useAxios>,
    {
        format,
        resumeFeedback,
        jdMatchFeedback,
        matchScore,
        onUploadProgress,
    }: ExportFileOptions
): Promise<void> {
    const payload = {
        resume_feedback: resumeFeedback,
        jdmatch_feedback: jdMatchFeedback,
        match_score: matchScore, // Send as float
    };

    const response = await axiosInstance.post(`/export/${format}`, payload, {
        responseType: "blob",
        headers: { "Content-Type": "application/json" },
        onUploadProgress,
    });

    if (response.status !== 200) {
        throw new Error(`Failed to export ${format.toUpperCase()} file`);
    }

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume_result.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
}

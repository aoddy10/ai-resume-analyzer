import useAxios from "@/hooks/useAxios";
import type { AxiosProgressEvent } from "axios";

interface ExportFileOptions {
    format: "pdf" | "md";
    feedback: string;
    matchScore: number;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function exportFile(
    axiosInstance: ReturnType<typeof useAxios>,
    { format, feedback, matchScore, onUploadProgress }: ExportFileOptions
): Promise<void> {
    const params = {
        feedback: encodeURIComponent(feedback),
        match_score: encodeURIComponent(matchScore.toString()),
    };

    const response = await axiosInstance.get(`/export/${format}`, {
        responseType: "blob",
        params,
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

import useAxios from "@/hooks/useAxios";
import type { AxiosProgressEvent } from "axios";

interface MatchJDOptions {
    jdFile: File;
    resumeText: string;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function matchJDWithResume(
    axiosInstance: ReturnType<typeof useAxios>,
    { jdFile, resumeText, onUploadProgress }: MatchJDOptions
): Promise<{
    match_score: number;
    gap_feedback: { suggestions: string[] };
}> {
    const formData = new FormData();
    formData.append("jd_file", jdFile);
    formData.append("resume_text", resumeText);

    const response = await axiosInstance.post("/match", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });

    // Assuming the new response format is { data: { match_score: number, suggestions: string[] } }
    return response.data;
}

import useAxios from "@/hooks/useAxios";
import type { AxiosProgressEvent } from "axios";

interface UploadResumeOptions {
    file: File;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

interface ResumeFeedback {
    strengths: string[];
    areas_for_improvement: string[];
    missing_information: string[];
}

interface UploadResumeResponse {
    success: boolean;
    message: string;
    filename: string;
    resume_text: string;
    resume_feedback: ResumeFeedback;
}

export async function uploadResume(
    axiosInstance: ReturnType<typeof useAxios>,
    { file, onUploadProgress }: UploadResumeOptions
): Promise<UploadResumeResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });

    return response.data;
}

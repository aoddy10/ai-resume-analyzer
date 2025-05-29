import useAxios from "@/hooks/useAxios";
import type { AxiosProgressEvent } from "axios";

interface UploadResumeOptions {
    file: File;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function uploadResume(
    axiosInstance: ReturnType<typeof useAxios>,
    { file, onUploadProgress }: UploadResumeOptions
) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });

    return response.data;
}

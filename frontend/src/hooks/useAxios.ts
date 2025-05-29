import axios from "axios";

const useAxios = () => {
    const instance = axios.create({
        baseURL:
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    // Optional: Add interceptors if needed
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("Axios error:", error);
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;

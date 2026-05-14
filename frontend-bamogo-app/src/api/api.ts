import axios from "axios";
import { usePathname } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const apiUpload = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});


/*api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});*/


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401 && !window.location.pathname.includes("/login")) {
            window.location.href = "/login";
        }
        if (status === 500) {
            window.location.href = "/500";
        }

        return Promise.reject(error.response);
    }
);

/*apiUpload.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});*/




apiUpload.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            window.location.href = "/login";
        }
        if (status === 500) {
            window.location.href = "/500";
        }

        return Promise.reject(error.response);
    }
);
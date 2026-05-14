import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api, apiUpload } from "./api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions<T> {
  method: HttpMethod;
  url: string;
  data?: T;
  config?: AxiosRequestConfig;
}

export async function request<T = any, R = any>({
  method,
  url,
  data,
  config,
}: RequestOptions<T>): Promise<AxiosResponse<R>> {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });

    return response;
  } catch (error: any) {
    throw error;
  }
}


export async function requestUpload<T = any, R = any>({
  method,
  url,
  data,
  config,
}: RequestOptions<T>): Promise<AxiosResponse<R>> {
  try {
    const response = await apiUpload({
      method,
      url,
      data,
      ...config,
    });

    return response;
  } catch (error: any) {
    throw error;
  }
}


export const http = {
  get: <R = any>(url: string, config?: AxiosRequestConfig) =>
    request<null, R>({ method: "GET", url, config }),

  post: <T = any, R = any>(url: string, data: T) =>
    request<T, R>({ method: "POST", url, data }),

  put: <T = any, R = any>(url: string, data: T) =>
    request<T, R>({ method: "PUT", url, data }),

  delete: <R = any>(url: string) =>
    request<null, R>({ method: "DELETE", url }),
};

export const httpUpload = {
  post: <T = any, R = any>(url: string, data: T) =>
    requestUpload<T, R>({ method: "POST", url, data }),
};
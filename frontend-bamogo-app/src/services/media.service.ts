import { http, httpUpload } from "@/api/requete";

export const mediaService = {
  getAll: (page?: number, include?: string) =>
    http.get(`/medias?page=${page}&include=${include}`),

  getById: (id: number, include?: string) => http.get(`/medias/${id}&include=${include}`),

  update: (id: number, data: any) =>http.put(`/medias/${id}`, data),

  post: (data: any) =>httpUpload.post(`/medias`, data),

  delete: (id: number) => http.delete(`/medias/${id}`),
};
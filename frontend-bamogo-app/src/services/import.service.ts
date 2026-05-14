import { http } from "@/api/requete";

export const importService = {
  getAll: (page?: number, include?: string) =>
    http.get(`/imports?page=${page}&include=${include}`),

  getById: (id: number, include?: string) => http.get(`/imports/${id}&include=${include}`),

  update: (id: number, data: any) =>http.put(`/imports/${id}`, data),

  post: (data: any) =>http.post(`/imports`, data),

  delete: (id: number) => http.delete(`/imports/${id}`),
};
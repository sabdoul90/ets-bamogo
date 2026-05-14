import { http } from "@/api/requete";

export const clientService = {
  getAll: (page?: number, limit?: number, include?: string) =>
    http.get(`/clients?page=${page}&limit=${limit}&include=${include}`),

  post: (data: any) =>http.post(`/clients`, data),

  getById: (id: number, include?: string) => http.get(`/clients/${id}&include=${include}`),

  update: (id: number, data: any) =>http.put(`/clients/${id}`, data),

  delete: (id: number) => http.delete(`/clients/${id}`),
};
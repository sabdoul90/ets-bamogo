import { http } from "@/api/requete";

export const venteService = {
  getAll: (page?: number, include?: string) =>
    http.get(`/ventes?page=${page}&include=${include}`),


  post: (data: any) =>http.post(`/ventes`, data),

  getById: (id: number, include?: string) => http.get(`/ventes/${id}?include=${include}`),

  update: (id: number, data: any) =>http.put(`/ventes/${id}`, data),

  delete: (id: number) => http.delete(`/ventes/${id}`),
};
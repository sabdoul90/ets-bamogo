import { http } from "@/api/requete";

export const produitService = {
  getAll: (page?: number, limit?: number, include?: string) =>
    http.get(`/produits?page=${page}&limit=${limit}&include=${include}`),

  post: (data: any) =>http.post(`/produits`, data),

  getById: (id: number, include?: string) => http.get(`/produits/${id}&include=${include}`),

  update: (id: number, data: any) =>http.put(`/produits/${id}`, data),

  delete: (id: number) => http.delete(`/produits/${id}`),
};
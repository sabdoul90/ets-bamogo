import { http } from "@/api/requete";

export const venteproduitService = {
  getAll: (page?: number, include?: string) =>
    http.get(`/venteproduits?page=${page}&include=${include}`),

  post: (data: any) =>http.post(`/venteproduits`, data),

  getById: (id: number, include?: string) => http.get(`/venteproduits/${id}&include=${include}`),

  update: (id: number, data: any) =>http.put(`/venteproduits/${id}`, data),

  delete: (id: number) => http.delete(`/venteproduits/${id}`),
};
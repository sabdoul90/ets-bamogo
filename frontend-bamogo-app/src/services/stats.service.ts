import { http } from "@/api/requete";

export const statsService = {
    get: () => http.get(`/stats`),
};
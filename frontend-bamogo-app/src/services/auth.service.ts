import { http } from "@/api/requete";

export const authService = {

  login: (data: any) =>
    http.post("/auth/login", data),

  logout: () =>
    http.post("/auth/logout", {}),

  me: () =>
    http.get("/auth/me", {
      withCredentials: true,
    }),
};
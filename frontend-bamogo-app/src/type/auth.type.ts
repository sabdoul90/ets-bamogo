import { Utilisateur } from "./user.type";

export interface LoginPayload {
  telephone: string;
  mot_de_passe: string;
}

export interface LoginResponse {
  token: string;
  message : string
  utilsateur : Utilisateur
}
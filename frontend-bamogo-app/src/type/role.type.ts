import { Utilisateur } from "./user.type";

export interface Role {
  id: number;
  titre: string;

  utilisateurs?: Utilisateur[];
}
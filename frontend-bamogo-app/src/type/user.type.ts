import { Etablissement } from "./etablissement.type";
import { Role } from "./role.type";

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  token?: string;
  mot_de_passe?: string;

  role?: Role;
  etablissement?: Etablissement;
}
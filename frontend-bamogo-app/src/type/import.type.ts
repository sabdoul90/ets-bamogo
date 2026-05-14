import { Etablissement } from "./etablissement.type";
import { Media } from "./media.type";

export interface Import {
  id: number;
  titre: string;
  type: string;
  statut: string;

  media? : Media;
  fichier_journal? : Media,
  etablissement? : Etablissement
}
import { Etablissement } from "./etablissement.type";
import { Vente } from "./vente.type";

export interface Client {
  id: number;
  nom_prenom: string;
  telephone: string;

  ventes?: Vente[];
  etablissement?: Etablissement;
}
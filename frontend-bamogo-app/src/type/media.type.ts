import { Etablissement } from "./etablissement.type";
import { Import } from "./import.type";
import { Vente } from "./vente.type";

export interface Media {
  id: number;
  nom: string;
  type: string;
  url: string;
  etablissement?: Etablissement;
  vente?: Vente;
  import?: Import;
}
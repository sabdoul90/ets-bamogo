import { Etablissement } from "./etablissement.type";
import { VenteProduit } from "./venteproduit.type";

export interface Produit {
  id: number;
  nom: string;

  prix_unitaire?: number ;
  quantite_stock?: number;

  id_etablissement?: number;

  etablissement?: Etablissement;
  vendus?: VenteProduit[];
}
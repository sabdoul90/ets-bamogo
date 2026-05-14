import { Produit } from "./produit.type";
import { Vente } from "./vente.type";

export interface VenteProduit {
  id: number;
  quantite: number;
  cout_unitaire: number;
  vente?: Vente;
  produit?: Produit;
}
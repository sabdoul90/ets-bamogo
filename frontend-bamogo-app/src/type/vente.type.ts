import { Client } from "./client.type";
import { Etablissement } from "./etablissement.type";
import { Media } from "./media.type";
import { VenteProduit } from "./venteproduit.type";

export interface Vente {
  id: number;

  montant?: number;
  reduction?: number;

  id_etablissement?: number;
  id_client?: number;
  id_media?: number;
  createdAt : string,
  uptadedAt : string,
  etablissement?: Etablissement;
  client?: Client;
  media?: Media;

  vendus?: VenteProduit[];
}
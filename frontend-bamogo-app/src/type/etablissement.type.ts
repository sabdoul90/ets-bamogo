import { Client } from "./client.type";
import { Import } from "./import.type";
import { Media } from "./media.type";
import { Produit } from "./produit.type";
import { Utilisateur } from "./user.type";
import { Vente } from "./vente.type";

export interface Etablissement {
    id: number;
    nom: string;
    email?: string;
    telephone: string;
    statut: string

    travailleurs?: Utilisateur[];

    clients?: Client[];

    produits?: Produit;

    imports? : Import[];


    media?: Media;

    ventes?: Vente[];
}
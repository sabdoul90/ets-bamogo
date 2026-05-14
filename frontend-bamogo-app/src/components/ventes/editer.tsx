"use client";

import { Produit } from "@/type/produit.type";
import Modal from "../dashboard/modal";
import { X } from "lucide-react";
import { useState, useEffect, UIEvent, ChangeEvent, useCallback } from "react";
import { produitService } from "@/services/produit.service";
import { VenteProduit } from "@/type/venteproduit.type";
import { Client } from "@/type/client.type";
import { clientService } from "@/services/client.service";
import { venteService } from "@/services/vente.service";
import { genererPDF } from "@/utils/genererpdf";
import { mediaService } from "@/services/media.service";
import { Vente } from "@/type/vente.type";
import { Media } from "@/type/media.type";
import { venteproduitService } from "@/services/venteproduit.service";
import { useAuth } from "@/contexte/authContext";
import { useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
    id: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditerVenteModal({ id, isOpen, onClose }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefClient = useRef<HTMLInputElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const [positionClient, setPositionClient] = useState({ top: 0, left: 0, width: 0 });

    const [produits, setProduits] = useState<Produit[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [vente, setVente] = useState<Vente | null>(null);

    const [selection, setSelection] = useState<VenteProduit[]>([]);

    const [query, setQuery] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [nom_prenom, setNomPrenom] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [queryClient, setQueryClient] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [pageClient, setPageClient] = useState<number>(1);
    const [hasMoreClients, setHasMoreClients] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [success, setSuccess] = useState(false);

    const { utilisateur } = useAuth();

    const [afficherSuggestion, setAfficherSuggestion] = useState<boolean>(false);
    const [afficherSuggestionClient, setAfficherSuggestionClient] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [isLoadingData, setIsLoadingData] = useState(false);

    const filteredSuggestionsClients = clients.filter((client) =>
        client.nom_prenom.toLowerCase().includes(queryClient.toLowerCase())
    );

    const filteredSuggestions = produits.filter((produit) =>
        produit.nom.toLowerCase().includes(query.toLowerCase())
    );

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setError("");

        const correspondances = produits.filter((prod) =>
            prod.nom.toLowerCase().includes(value.toLowerCase())
        );

        if (value.length > 0 && correspondances.length > 0) {
            setAfficherSuggestion(true);
        } else {
            setAfficherSuggestion(false);
        }
    };

    const handleQueryChangeClient = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQueryClient(value);
        setError("");
        setNomPrenom(value);

        const correspondances = clients.filter((client) =>
            client.nom_prenom.toLowerCase().includes(value.toLowerCase())
        );

        if (value.length > 0 && correspondances.length > 0) {
            setAfficherSuggestionClient(true);
        } else {
            setAfficherSuggestionClient(false);
        }
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    const handleScrollClient = (e: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMoreClients) {
            setPageClient((prev) => prev + 1);
        }
    };

    const handleSelectProduit = (item: Produit): void => {
        setSelection((prev) => {
            const exists = prev.find(p => p.produit?.id === item.id);
            if (exists) return prev;

            const newVenteProduit: VenteProduit = {
                id: item.id, // Temporary ID for new items
                quantite: 1,
                cout_unitaire: item.prix_unitaire!,
                produit: item,
            };
            return [newVenteProduit, ...prev];
        });
        setQuery("");
        setAfficherSuggestion(false);
    };

    const handleSelectClient = (item: Client): void => {
        setClient(item);
        setNomPrenom(item.nom_prenom);
        setTelephone(item.telephone);
        setQueryClient(item.nom_prenom);
        setAfficherSuggestionClient(false);
    };

    const total = selection.reduce((acc, p) => {
        const prix = p.cout_unitaire ? p.cout_unitaire : 0;
        const qte = p.quantite ?? 0;
        return acc + prix * qte;
    }, 0);

    const updateQty = (id: number, quantite: number) => {
        const validQty = Math.max(0, quantite);
        setSelection((prev) =>
            prev.map((p) => (p.id === id ? { ...p, quantite: validQty } : p))
        );
    };

    const updatePrixUnitaire = (id: number, prix_unitaire: number) => {
        const validPrix = Math.max(0, prix_unitaire);
        setSelection((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, cout_unitaire: validPrix } : p
            )
        );
    };

    const removeProduit = (id: number) => {
        setSelection((prev) => prev.filter((p) => p.id !== id));
    };

    const resetForm = () => {
        setSelection([]);
        setClient(null);
        setVente(null);
        setNomPrenom("");
        setTelephone("");
        setQueryClient("");
        setQuery("");
        setError("");
        setMessage("");
        setPage(1);
        setPageClient(1);
        setHasMore(true);
        setHasMoreClients(true);
        setProduits([]);
        setClients([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const editerVente = async () => {
        if (!nom_prenom.trim() || !telephone.trim()) {
            setError("Veuillez sélectionner ou saisir les informations du client");
            return;
        }

        if (selection.length === 0) {
            setError("Veuillez ajouter au moins un produit");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            let nouveauClient: Client;
            if (!client) {
                const clientRequete = await clientService.post({ "nom_prenom": nom_prenom, "telephone": telephone, "id_etablissement": 1 });
                if (clientRequete.status === 201) {
                    nouveauClient = clientRequete.data.data;
                } else {
                    setError(clientRequete.data.data.message || "Erreur lors de la création du client");
                    setIsLoading(false);
                    return;
                }
            } else {
                nouveauClient = client;
            }

            console.log('Selection : ',selection);

            // Generate new PDF
            const pdf = await genererPDF(nouveauClient!, selection, total);
            const fileFormData = new FormData();
            fileFormData.append("file", pdf);

            const upload = await mediaService.post(fileFormData);

            if (upload.status !== 201) {
                setError(upload.data.data.message || "Erreur lors de la création du media");
                setIsLoading(false);
                return;
            }
            const media = upload.data.data;

            // Update vente
            const venteRequeste = await venteService.update(id, {
                "montant": total,
                "id_client": nouveauClient!.id,
                "id_etablissement": utilisateur ? utilisateur.etablissement?.id : 1,
                "id_media": media!.id,
            });

            if (venteRequeste.status !== 200) {
                setError(venteRequeste.data.data.message || "Erreur lors de la mise à jour de la vente");
                setIsLoading(false);
                return;
            }

            // Delete old venteproduits
            if (vente?.vendus) {
                for (const vp of vente.vendus) {
                    await venteproduitService.delete(vp.id);
                }
            }

            // Create new venteproduits
            for (const vp of selection) {

                const venteproduitRequete = await venteproduitService.post({
                    "id_vente": id,
                    "id_produit": vp.produit?.id!,
                    "quantite": vp.quantite!,
                    "cout_unitaire": vp.cout_unitaire
                });

                if (venteproduitRequete.status === 201) {
                    // Update product stock if needed
                    await produitService.update(
                        vp.produit?.id!,
                        { prix_unitaire: vp.cout_unitaire, quantite_stock: vp.produit!.quantite_stock! - vp.quantite! }
                    );
                }

            }

            setError("Mise à jour de la vente effectuée avec succès");
            setIsLoading(false);
            setSuccess(true);

        } catch (err) {
            console.log("Erreur lors de la mise à jour de la vente : ", err);
            setError("Erreur lors de la mise à jour de la vente");
            setIsLoading(false);
            setSuccess(false);
        }
    };

    const recupProduit = useCallback(async (page: number) => {
        const requete = await produitService.getAll(page, 50, "etablissement");
        if (requete.status === 200) {
            if (requete.data.data.length === 0) {
                setHasMore(false);
            } else {
                setProduits((prev) => [...prev, ...requete.data.data]);
            }
        } else {
            setMessage(requete.data.data.message);
        }
    }, []);

    const recupClient = useCallback(async (page: number) => {
        const requete = await clientService.getAll(page, 50);
        if (requete.status === 200) {
            if (requete.data.data.length === 0) {
                setHasMoreClients(false);
            } else {
                setClients((prev) => [...prev, ...requete.data.data]);
            }
        } else {
            setMessage(requete.data.data.message);
        }
    }, []);

    const recupVente = useCallback(async () => {
        setIsLoadingData(true);
        const requete = await venteService.getById(id, 'client,etablissement,media,produits');
        console.log("Requete vente : ", requete);
        if (requete.status === 200) {
            const venteData = requete.data.data;
            console.log("Vente data dans editer : ", venteData);
            setVente(venteData);
            setClient(venteData.client || null);
            setNomPrenom(venteData.client?.nom_prenom || "");
            setTelephone(venteData.client?.telephone || "");
            setQueryClient(venteData.client?.nom_prenom || "");
            // Convert vendus to selection format
            const selectionData: VenteProduit[] = venteData.vendus?.map((vp: VenteProduit) => ({
                id: vp.id,
                quantite: vp.quantite,
                cout_unitaire: vp.cout_unitaire,
                produit: vp.produit,
            })) || [];
            setSelection(selectionData);
        } else {
            setError("Erreur lors du chargement de la vente");
        }
        setIsLoadingData(false);
    }, [id]);

    useEffect(() => {
        if (isOpen && id) {
            recupVente();
        }
    }, [isOpen, id, recupVente]);

    useEffect(() => {
        if (!isOpen) return;

        recupProduit(page);
    }, [isOpen, page, recupProduit]);

    useEffect(() => {
        if (!isOpen) return;

        recupClient(pageClient);
    }, [isOpen, pageClient, recupClient]);
    

    if (isLoadingData) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose}>
                <div className="flex justify-center items-center h-64">
                    <p>Chargement de la vente...</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-principal-semi-bold">Éditer la vente</h2>
                <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                    <label htmlFor="client-nom" className="block text-sm font-medium mb-1">Nom et prénom du client</label>
                    <input
                        ref={inputRefClient}
                        id="client-nom"
                        type="text"
                        name="nom_prenom"
                        value={queryClient}
                        onChange={(e) => {
                            setQueryClient(e.target.value);
                            handleQueryChangeClient(e);
                        }}
                        onBlur={() =>
                            setTimeout(() => setAfficherSuggestionClient(false), 500)
                        }
                        onFocus={() => {
                            if (inputRefClient.current) {
                                const rect = inputRefClient.current.getBoundingClientRect();

                                setPositionClient({
                                    top: rect.bottom,
                                    left: rect.left,
                                    width: rect.width
                                });
                            }
                            if (queryClient.length > 0) setAfficherSuggestionClient(true);
                        }}
                        placeholder="Nom et prénom du client"
                        className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                    {afficherSuggestionClient && filteredSuggestionsClients.length > 0 && (
                        createPortal(
                            <div
                                style={{
                                    position: "fixed",
                                    top: positionClient.top,
                                    left: positionClient.left,
                                    width: positionClient.width,
                                    zIndex: 9999
                                }}
                                className="absolute left-0 w-full mt-1 bg-(--blanc) shadow-lg rounded-lg max-h-50 overflow-y-auto z-9999 overscroll-contain"
                                onScroll={handleScrollClient}
                                onWheel={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                            >
                                <ul className="divide-y">
                                    {filteredSuggestionsClients.map((item, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelectClient(item)}
                                            className="px-4 py-2 cursor-pointer hover:bg-(--gris) transition border border-(--bordure-color)"
                                        >
                                            {item.nom_prenom} - {item.telephone}
                                        </li>
                                    ))}
                                </ul>
                                {hasMoreClients && (
                                    <p className="text-center py-2 text-sm text-gray-500">
                                        Chargement...
                                    </p>
                                )}
                            </div>
                            , document.body
                        )

                    )}
                </div>
                <div>
                    <label htmlFor="client-tel" className="block text-sm font-medium mb-1">Numéro du client</label>
                    <input
                        id="client-tel"
                        type="text"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="Numéro du client"
                        className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="produit-search" className="block text-sm font-medium mb-1">Ajouter un produit</label>
                <div className="relative">
                    <input
                        ref={inputRef}
                        id="produit-search"
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        onFocus={() => {
                            if (inputRef.current) {
                                const rect = inputRef.current.getBoundingClientRect();

                                setPosition({
                                    top: rect.bottom,
                                    left: rect.left,
                                    width: rect.width
                                });
                            }
                            if (query.length > 0) setAfficherSuggestion(true);
                        }}
                        placeholder="Ajouter un produit"
                        className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                    {afficherSuggestion && filteredSuggestions.length > 0 && (
                        createPortal(
                            <div
                                style={{
                                    position: "fixed",
                                    top: position.top,
                                    left: position.left,
                                    width: position.width,
                                    zIndex: 9999
                                }}
                                className="absolute left-0 w-full mt-1 bg-(--blanc) shadow-lg rounded-lg max-h-50 overflow-y-auto z-9999 overscroll-contain"
                                onScroll={handleScroll}
                                onWheel={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                            >
                                <ul className="divide-y">
                                    {filteredSuggestions.map((item, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelectProduit(item)}
                                            className="px-4 py-2 cursor-pointer hover:bg-(--gris) transition border border-(--bordure-color)"
                                        >
                                            {item.nom}
                                        </li>
                                    ))}
                                </ul>
                                {hasMore && (
                                    <p className="text-center py-2 text-sm text-gray-500">
                                        Chargement...
                                    </p>
                                )}
                            </div>
                            , document.body
                        )
                    )}
                </div>
            </div>

            <div className="border border-(--bordure-color) rounded-xl mb-4">
                {selection.map((p, index) => (
                    <div
                        key={p.id}
                        className={`
        flex justify-between items-center p-3
        border-b border-(--bordure-color) last:border-b-0
        first:rounded-t-xl last:rounded-b-xl
      `}
                    >
                        <span>{p.produit?.nom}</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="texte-normal-regular font-medium">Prix:</label>
                                <input
                                    type="number"
                                    value={p.cout_unitaire ?? 0}
                                    onChange={(e) =>
                                        updatePrixUnitaire(p.id, Number(e.target.value))
                                    }
                                    className="w-24 rounded px-2 py-1 texte-normal-regular border border-(--bordure-color)  outline-none focus:ring-1 focus:ring-(--primary)"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="texte-normal-regular font-medium">Quantité:</label>
                                <input
                                    type="number"
                                    value={p.quantite ?? 0}
                                    onChange={(e) =>
                                        updateQty(p.id, Number(e.target.value))
                                    }
                                    className="w-16 rounded px-2 py-1 texte-normal-regular border border-(--bordure-color)   outline-none focus:ring-1 focus:ring-(--primary)"
                                />
                            </div>
                        </div>
                        <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={() => removeProduit(p.id)}>
                            <X size={22} />
                        </button>
                    </div>
                ))}
            </div>

            {error && (
                <div className={`mb-4 p-3 ${success ? "bg-(--success-dilue) border border-(--success)" : "bg-(--erreur-dilue) border border-(--erreur)"} text-(--noir) rounded`}>
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center">
                <span className="font-semibold">
                    TOTAL : {total.toLocaleString('fr-FR')} FCFA
                </span>
                <button
                    onClick={editerVente}
                    disabled={isLoading}
                    className="bg-(--info) text-(--blanc) px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--btn-primaire) transition-colors"
                >
                    {isLoading ? "Mise à jour..." : "Mettre à jour la facture"}
                </button>
            </div>
        </Modal>
    );
}

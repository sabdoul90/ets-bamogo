"use client";

import { Produit } from "@/type/produit.type";
import { useState, useEffect, UIEvent, ChangeEvent, useCallback, useRef, Suspense } from "react";
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
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AjouterVentePage() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefClient = useRef<HTMLInputElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const [positionClient, setPositionClient] = useState({ top: 0, left: 0, width: 0 });

    const [produits, setProduits] = useState<Produit[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [client, setClient] = useState<Client | null>(null);

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
        router.back();
    };

    const enregistrerVente = async () => {

        let media: Media;
        let vente: Vente;
        let nouveauClient: Client;
        setSuccess(false);

        //console.log(nom_prenom);
        //console.log(telephone);

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

            if (!client) {
                const clientRequete = await clientService.post({ "nom_prenom": nom_prenom, "telephone": telephone, "id_etablissement": 1 });

                if (clientRequete.status === 201) {
                    nouveauClient = clientRequete.data.data;
                    console.log("Client créé avec succès : ", clientRequete.data.data);
                    console.log("Nouveau client inexistant: ", nouveauClient!);
                } else {
                    setError(clientRequete.data.data.message || "Erreur lors de la création du client");
                    setIsLoading(false);
                    return;
                }

            } else {
                nouveauClient = client
                console.log("Nouveau client existant: ", nouveauClient!);

            }

            console.log("Nouveau client  avant creation pdf: ", nouveauClient!);
            console.log("Total : ", total);

            const pdf = await genererPDF(nouveauClient!, selection, total);



            const fileFormData = new FormData();

            fileFormData.append(
                "file",
                pdf,
            );



            const uplad = await mediaService.post(fileFormData);

            if (uplad.status === 201) {
                //console.log("Media créé avec succès : ", uplad.data.data.id);
                media = uplad.data.data;
                console.log("Media créé avec succès : ", uplad.data.data);
            } else {
                setError(uplad.data.data.message || "Erreur lors de la création du media");
                setIsLoading(false);
            }

            console.log("Nouveau client  avant creation vente: ", nouveauClient?.id);

            const venteRequeste = await venteService.post({
                "montant": total,
                "id_client": nouveauClient!.id,
                "id_etablissement": utilisateur ? utilisateur.etablissement?.id : 1,
                "id_media": media!.id,
            });

            if (venteRequeste.status === 201) {
                vente = venteRequeste.data.data;
                //console.log("Vente créé avec succès : ", venteRequeste.data.data);
            } else {
                setError(venteRequeste.data.data.message || "Erreur lors de la création de la vente");
                setIsLoading(false);
            }

            //console.log("Vente : ", vente!);

            for (const vp of selection) {

                const venteproduitRequete = await venteproduitService.post(
                    {
                        "id_vente": vente!.id,
                        "id_produit": vp.produit?.id!,
                        "quantite": vp.quantite!,
                        "cout_unitaire": vp.cout_unitaire
                    }
                );

                if (venteproduitRequete.status === 201) {

                    await produitService.update(
                        vp.produit?.id!,
                        { prix_unitaire: vp.cout_unitaire, quantite_stock: vp.produit!.quantite_stock! - vp.quantite! }
                    );

                };

                //console.log("VenteProduit requete : ", venteproduitRequete);
            }

            console.log("");
            setError("Enregistrement de la vente effectué avec succès");
            setIsLoading(false);
            setSuccess(true);

        } catch (err) {
            console.log("Erreur lors de l'enregistrement de la vente : ", err);
            setError("Erreur lors de l'enregistrement de la vente");
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




    useEffect(() => {


        recupProduit(page);
    }, [page, recupProduit]);

    useEffect(() => {


        recupClient(pageClient);
    }, [pageClient, recupClient]);


    if (isLoadingData) {
        return (

            <div className="flex justify-center items-center h-64">
                <p>Chargement de la vente...</p>
            </div>

        );
    }

    return (
        <motion.div
            className="
        fixed inset-0 z-50
        bg-(---blanc)
        flex items-center justify-center
        p-0 sm:p-4
    "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >

            <motion.div
                className="
        w-full h-dvh sm:h-auto
        sm:max-w-3xl
        bg-(--blanc)
        flex flex-col
        overflow-hidden
        sm:rounded-3xl
    "
            >

                {/* HEADER */}
                <div
                    className="
                    sticky top-0 z-20
                    bg-(--blanc)
                    border-b border-(--bordure-color)
                    px-4 py-4
                    flex items-center justify-between
                "
                >

                    <div>
                        <h2 className="text-lg font-semibold">
                            Faire une vente
                        </h2>
                    </div>

                    <button
                        onClick={handleClose}
                        className="
                        px-3 py-2
                        rounded-xl
                        border border-(--bordure-color)
                        flex items-center justify-center
                    "
                    >
                        Annuler
                    </button>

                </div>

                {/* CONTENT */}
                <div
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-5">


                    <div className="space-y-4">

                        <div className="relative">

                            <label
                                htmlFor="client-nom"
                                className="block text-sm font-medium mb-1"
                            >
                                Nom et prénom du client
                            </label>

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
                                    setTimeout(
                                        () =>
                                            setAfficherSuggestionClient(false),
                                        300
                                    )
                                }
                                onFocus={() => {
                                    if (inputRefClient.current) {

                                        const rect =
                                            inputRefClient.current.getBoundingClientRect();

                                        setPositionClient({
                                            top: rect.bottom + 4,
                                            left: rect.left,
                                            width: rect.width
                                        });
                                    }

                                    if (queryClient.length > 0) {
                                        setAfficherSuggestionClient(true);
                                    }
                                }}
                                placeholder="Nom et prénom du client"
                                className="w-full h-12 px-3 border border-(--bordure-color) rounded-xl outline-none focus:ring-1 focus:ring-(--primary)"/>

                            {afficherSuggestionClient &&
                                filteredSuggestionsClients.length > 0 &&
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
                                                    onClick={() =>
                                                        handleSelectClient(item)
                                                    }
                                                    className="
                                                        px-3 py-2 cursor-pointer active:bg-(--gris) transition border border-(--bordure-color)">
                                                    <p className="font-medium text-(--noir)">
                                                        {item.nom_prenom}
                                                    </p>

                                                    <p className="text-sm text-(--noir)">
                                                        {item.telephone}
                                                    </p>
                                                </li>

                                            ))}

                                        </ul>

                                        {hasMoreClients && (
                                            <p className="text-center py-2 text-sm text-gray-500">
                                                Chargement...
                                            </p>
                                        )}

                                    </div>,
                                    document.body
                                )}

                        </div>

                        <div>

                            <label
                                htmlFor="client-tel"
                                className="block text-sm font-medium mb-1"
                            >
                                Numéro du client
                            </label>

                            <input
                                id="client-tel"
                                type="text"
                                value={telephone}
                                onChange={(e) =>
                                    setTelephone(e.target.value)
                                }
                                placeholder="Numéro du client"
                                className="
                                w-full h-12
                                px-3
                                border border-(--bordure-color)
                                rounded-xl
                                outline-none
                                focus:ring-1 focus:ring-(--primary)
                            "
                            />

                        </div>

                    </div>

                    {/* PRODUITS */}
                    <div>

                        <label
                            htmlFor="produit-search"
                            className="block text-sm font-medium mb-1"
                        >
                            Ajouter un produit
                        </label>

                        <div className="relative">

                            <input
                                ref={inputRef}
                                id="produit-search"
                                type="text"
                                value={query}
                                onChange={handleQueryChange}
                                onFocus={() => {

                                    if (inputRef.current) {

                                        const rect =
                                            inputRef.current.getBoundingClientRect();

                                        setPosition({
                                            top: rect.bottom + 4,
                                            left: rect.left,
                                            width: rect.width
                                        });
                                    }

                                    if (query.length > 0) {
                                        setAfficherSuggestion(true);
                                    }
                                }}
                                placeholder="Ajouter un produit"
                                className="
                                w-full h-12
                                px-3
                                border border-(--bordure-color)
                                rounded-xl
                                outline-none
                                focus:ring-1 focus:ring-(--primary)
                            "
                            />

                            {afficherSuggestion &&
                                filteredSuggestions.length > 0 &&
                                createPortal(

                                    <div
                                        style={{
                                            position: "fixed",
                                            top: position.top,
                                            left: position.left,
                                            width: position.width,
                                            zIndex: 9999
                                        }}
                                        className="absolute left-0 w-sm mt-1 bg-(--blanc) shadow-lg rounded-lg max-h-50 overflow-y-auto z-9999 overscroll-contain"
                                        onScroll={handleScroll}
                                        onWheel={(e) => e.stopPropagation()}
                                        onTouchMove={(e) => e.stopPropagation()}
                                    >

                                        <ul className="divide-y">

                                            {filteredSuggestions.map((item, index) => (

                                                <li
                                                    key={index}
                                                    onClick={() =>
                                                        handleSelectProduit(item)
                                                    }
                                                    className="px-3 py-2 cursor-pointer hover:bg-(--gris) transition border border-(--bordure-color)">
                                                    {item.nom}
                                                </li>

                                            ))}

                                        </ul>

                                        {hasMore && (
                                            <p className="text-center py-2 text-sm text-gray-500">
                                                Chargement...
                                            </p>
                                        )}

                                    </div>,
                                    document.body
                                )}

                        </div>

                    </div>


                    <div
                        className={`space-y-3`}
                    >
                        {selection.map((p, index) => {

                            const numero = selection.length - index;

                            return (

                                <div
                                    key={p.id}
                                    className="border border-(--bordure-color) rounded-2xl p-3 space-y-4">

                                    <div className="flex items-start justify-between gap-3">

                                        <div>

                                            <p className="text-xs text-(--info) font-semibold">
                                                Produit n°{numero}
                                            </p>

                                            <p className="font-semibold">
                                                {p.produit?.nom}
                                            </p>

                                        </div>

                                        <button
                                            className="min-w-10 min-h-10 rounded-full border border-(--bordure-color) flex items-center justify-center"
                                            onClick={() => removeProduit(p.id)}
                                        >
                                            <X size={18} />
                                        </button>

                                    </div>

                                    <div className="grid grid-cols-2 gap-3">

                                        <div>

                                            <label className="text-sm font-medium mb-1 block">
                                                Prix unitaire
                                            </label>

                                            <input
                                                type="number"
                                                value={p.cout_unitaire ?? 0}
                                                onChange={(e) =>
                                                    updatePrixUnitaire(
                                                        p.id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full h-11 px-3 border border-(--bordure-color) rounded-xl outline-none"
                                            />

                                        </div>

                                        <div>

                                            <label className="text-sm font-medium mb-1 block">
                                                Quantité
                                            </label>

                                            <input
                                                type="number"
                                                value={p.quantite ?? 0}
                                                onChange={(e) =>
                                                    updateQty(
                                                        p.id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="
                                w-full h-11
                                px-3
                                border border-(--bordure-color)
                                rounded-xl
                                outline-none
                            "
                                            />

                                        </div>

                                    </div>

                                </div>

                            );
                        })}
                    </div>

                </div>


                <div
                    className="
                    sticky bottom-0
                    bg-(--blanc)
                    border-t border-(--bordure-color)
                    p-4
                    space-y-2
                "
                >
                    {error && (

                        <div
                            className={`
                            p-3 rounded-xl text-sm
                            ${success
                                    ? "bg-(--success-dilue) border border-(--success)"
                                    : "bg-(--erreur-dilue) border border-(--erreur)"
                                }
                        `}
                        >
                            {error}
                        </div>

                    )}

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-bold text-(--erreur)">
                            TOTAL :
                        </span>

                        <span className="text-lg font-bold">
                            {total.toLocaleString("fr-FR")} FCFA
                        </span>

                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--alerte) font-bold">
                            Nombre de produits :
                        </span>
                        <span className="text-sm font-bold">
                            {selection.length}
                        </span>
                    </div>

                    <button
                        onClick={enregistrerVente}
                        disabled={isLoading}
                        className="
                        w-full h-12 text-(--blanc) px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed bg-(--btn-primaire) transition-colors
                        
                        font-medium
                    "
                    >
                        {isLoading
                            ? "Enregistrement en cours..."
                            : "Enregistrer la vente"}
                    </button>

                </div>

            </motion.div>

        </motion.div>
    );
}

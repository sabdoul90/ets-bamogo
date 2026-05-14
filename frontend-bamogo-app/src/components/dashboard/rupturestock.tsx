"use client";

import { Search, Eye, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Produit } from "@/type/produit.type";
import { useState, useEffect, useCallback } from "react";
import { produitService } from "@/services/produit.service";
import EditerProduitModal from "../produits/editer";



export default function RuptureTable() {

    const [produits, setProduits] = useState<Produit[]>([]);
    const [vide, setVide] = useState(false);

    const [search, setSearch] = useState("");

    const [isEditerModalOpen, setOpenAjouterProduit] = useState(false);
    const [selectedProduitId, setSelectedProduitId] = useState<number | null>(null);

    const produitsfiltres = produits.filter((p) =>
        p.nom.toLowerCase().includes(search.toLowerCase())
    );

    const recupProduit = useCallback(async (page: 1) => {
        console.log("Recup produit en rupture de stock");

        const requete = await produitService.getAll(page, 10, "etablissement");
        console.log("produit requete");
        console.log(requete.data.data);
        console.log(requete.status);



        if (requete.status === 200) {
            if (requete.data.data.length === 0) {
                setVide(true);
            } else {
                setProduits(requete.data.data);
            }
        }
    }, []);

    useEffect(() => {
        recupProduit(1);
    }, [recupProduit]);

    return (
        <div className="w-full mb-3">

            <h2 className="text-lg font-semibold mb-3">
                Produits en rupture de stock
            </h2>


            {vide == false && <div className="relative w-72 mb-4">
                <Search
                    size={18}
                    className="absolute left-3 top-2.5 text-(--gris)"
                />

                <input
                    type="text"
                    placeholder="Rechercher un produit"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-(--bordure-color) rounded-md text-normal-regular outline-none focus:ring-1 focus:ring-(--primary)"
                />
            </div>}

            {
                vide == true && <h1 className="text-center text-(--texte-principal)"></h1>
            }


            {
                vide == false &&
                <div className="overflow-hidden rounded-lg border border-(--bordure-color)">

                    <table className="w-full">

                        <thead className="bg-(--primary) text-(--blanc)">
                            <tr>
                                <th className="py-2 text-left px-6">Produit</th>
                                <th className="py-2 text-center">Quantité en stock</th>
                                <th className="py-2 text-center">Prix unitaire</th>
                                <th className="py-2 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {produitsfiltres.length == 0 ?
                                produits.map((produit, index) => (
                                    <motion.tr
                                        key={produit.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"
                                    >

                                        <td className="px-6 py-2">
                                            {produit.nom}
                                        </td>

                                        <td className="text-center">

                                            <span className="bg-(--secondary) text-(--blanc) text-normal-meduim px-3 py-1 rounded-md">
                                                {produit.quantite_stock}
                                            </span>

                                        </td>

                                        <td className="text-center">
                                            {produit.prix_unitaire!.toLocaleString()}
                                        </td>

                                        <td className="text-center">

                                            <div className="flex justify-center gap-3">

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-(--primary) text-(--blanc)  hover:bg-(--btn-primaire-focus)">
                                                    <Eye className="text-(--blanc)" size={18} />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-(--primary) text-(--blanc) hover:bg-(--btn-primaire-focus)">
                                                    <Pencil className="text-(--blanc)" size={18} />
                                                </motion.button>

                                            </div>

                                        </td>

                                    </motion.tr>
                                )) :
                                produitsfiltres.map((produit, index) => (
                                    <motion.tr
                                        key={produit.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"
                                    >

                                        <td className="px-6 py-2">
                                            {produit.nom}
                                        </td>

                                        <td className="text-center">

                                            <span className="bg-(--secondary) text-(--blanc) text-normal-meduim px-3 py-1 rounded-md">
                                                {produit.quantite_stock}
                                            </span>

                                        </td>

                                        <td className="text-center">
                                            {Number(produit.prix_unitaire!).toLocaleString("fr-FR")}
                                        </td>

                                        <td className="text-center">

                                            <div className="flex justify-center gap-3">

                                                { /* <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-(--primary) text-(--blanc)  hover:bg-(--btn-primaire-focus)">
                                                <Eye className="text-(--blanc)" size={18} />
                                            </motion.button> */}

                                                <motion.button
                                                    onClick={() => {
                                                        setSelectedProduitId(produit.id);
                                                        setOpenAjouterProduit(true);
                                                    }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-(--primary) text-(--blanc) hover:bg-(--btn-primaire-focus)">
                                                    <Pencil className="text-(--blanc)" size={18} />
                                                </motion.button>

                                            </div>

                                        </td>

                                    </motion.tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>
            }

            {produits.length > 0 && selectedProduitId !== null && (
                <EditerProduitModal
                    id={selectedProduitId!}
                    isOpen={isEditerModalOpen}
                    onClose={() => {
                        setOpenAjouterProduit(false);
                        setSelectedProduitId(null);
                        recupProduit(1);
                    }}
                />
            )}

        </div>
    );
}
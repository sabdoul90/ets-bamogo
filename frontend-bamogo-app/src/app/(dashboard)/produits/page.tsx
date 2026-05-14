"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Search } from "lucide-react";
import SupprimerProduitModal from "@/components/produits/supprimer";
import AjouterProduitModal from "@/components/dashboard/ajouterproduit";
import { Produit } from "@/type/produit.type";
import { produitService } from "@/services/produit.service";
import EditerProduitModal from "@/components/produits/editer";


export default function ProduitsPage() {

    const [produits, setProduits] = useState<Produit[]>([]);
    const [openAjouterProduit, setOpenAjouterProduit] = useState(false);
    const [openSupprimerProduit, setOpenSupprimerProduit] = useState(false);
    const [openEditerProduit, setOpenEditerProduit] = useState(false);
    const [produitId, setProduitId] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(1);
    const [search, setSearch] = useState("");

    const recupProduit = useCallback(async (page: number) => {

        const requete = await produitService.getAll(page, 10, "etablissement");
        console.log("produit requete");
        console.log(requete.data.data);
        console.log(requete.status);



        if (requete.status === 200) {
            setProduits(requete.data.data);
            setLimit(requete.data.pagination.pages);
        }
    }, []);

    const produitsfiltres = produits.filter((p) =>
        p.nom.toLowerCase().includes(search.toLowerCase())
    );


    useEffect(() => {
        recupProduit(page);
    }, [recupProduit, page]);

    return (
        <div className="p-4 md:p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="titre-section-meduim text-(--texte-principal)">Les ventes</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setOpenAjouterProduit(true)}
                        className="bg-(--primary) text-(--blanc) px-4 py-2 rounded-full texte-normal-semi-bold hover:bg-(--btn-primaire-focus) transition-colors">
                        Ajouter un produit
                    </button>
                </div>
            </div>



            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="relative w-72 mb-4">
                    <Search

                        size={18}
                        className="absolute left-3 top-2.5 text-(--gris)"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une vente"
                        /*value={search}
                        onChange={(e) => setSearch(e.target.value)}*/
                        className="w-full pl-9 pr-3 py-2 border border-(--bordure-color) rounded-md text-normal-regular outline-none focus:ring-1 focus:ring-(--primary)"
                    />
                </div>

                <div className="flex gap-2">
                    <button className="bg-(--alerte) text-(--blanc) px-4 py-2 rounded-full texte-normal-semi-bold hover:bg-(--secondary) transition-colors">
                        Exporter en Excel
                    </button>
                </div>


            </div>


            <div className="hidden md:block border border-(--bordure-color) rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-(--primary) text-(--blanc)">
                        <tr className="text-left text-sm">
                            <th className="py-2 text-left px-6">Nom</th>
                            <th className="py-2 text-left px-6">Quantite en stock</th>
                            <th className="py-2 text-left px-6">Prix unitaire</th>
                            <th className="py-2 text-left px-6">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {produits.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-(--gris)">
                                    Aucun produit disponible
                                </td>
                            </tr>
                        ) : (

                            produitsfiltres.length === 0 ?
                                produits.map((p, index) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{p.nom}</td>
                                        <td className="px-6 py-2">{p.quantite_stock}</td>
                                        <td className="px-6 py-2">{Number(p.prix_unitaire).toLocaleString("fr-FR")}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            

                                            <motion.button
                                                onClick={() => { setProduitId(p.id); setOpenSupprimerProduit(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                            <motion.button
                                                onClick={() => { setProduitId(p.id) ; setOpenEditerProduit(true);}}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Pencil size={18} className="text-(--blanc)" />
                                            </motion.button>

                                        </td>
                                    </motion.tr>
                                )) : produitsfiltres.map((p, index) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{p.nom}</td>
                                        <td className="px-6 py-2">{p.quantite_stock}</td>
                                        <td className="px-6 py-2">{Number(p.prix_unitaire).toLocaleString("fr-FR")}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            

                                            <motion.button
                                                onClick={() => { setProduitId(p.id); setOpenSupprimerProduit(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                            <motion.button
                                                onClick={() => { setProduitId(p.id); setOpenEditerProduit(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Pencil size={18} className="text-(--blanc)" />
                                            </motion.button>

                                        </td>
                                    </motion.tr>
                                )
                                )
                        )
                        }
                    </tbody>
                </table>
            </div>


            <div className="md:hidden flex flex-col gap-3">
                {produits.length === 0 ? (
                    <div className="border border-(--bordure-color) rounded-xl p-6 text-center text-(--gris)">
                        Aucun produit disponible
                    </div>
                ) : (
                    produits.map((p) => (
                        <div key={p.id} className="border border-(--bordure-color) hover:bg-(--bordure-color) rounded-xl p-3">
                            <div className="flex justify-between mb-2">
                                <span className="texte-normal-semi-bold ">{p.nom}</span>
                                <span className="texte-normal-regular text-(--gris)">{p.prix_unitaire}</span>
                            </div>

                            <div className="texte-normal-regular text-(--gris)">
                                <p>Montant: {Number(p.prix_unitaire).toLocaleString("fr-FR")}</p>
                            </div>

                            <div className="flex gap-2 mt-3">

                                <motion.button
                                    onClick={() => { setProduitId(p.id); setOpenSupprimerProduit(true); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                    <Trash2 size={18} className="text-(--blanc)" />
                                </motion.button>

                                <motion.button
                                    onClick={() => { setProduitId(p.id); setOpenEditerProduit(true); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                    <Pencil size={18} className="text-(--blanc)" />
                                </motion.button>
                            </div>
                        </div>
                    )))}
            </div>


            <div className="flex justify-end mt-4 gap-2">
                <button disabled={page === 1} onClick={
                    () => {
                        if (page > 1) {
                            setPage(page - 1);
                        }
                    }
                } className="px-3 py-1 bg-(--primary) hover:bg-(--btn-primaire-focus) text-(--blanc) rounded">{"<"}</button>
                <button className="px-3 py-1 bg-(--primary) text-(--blanc) rounded">{page} / {limit}</button>
                <button disabled={page === limit} onClick={() => {
                    if (page < limit) {
                        setPage(page + 1);
                    }
                }} className="px-3 py-1 bg-(--primary) hover:bg-(--btn-primaire-focus) text-(--blanc) rounded">{">"}</button>
            </div>
            <AjouterProduitModal
                isOpen={openAjouterProduit}
                onClose={() => {
                    setOpenAjouterProduit(false);
                    recupProduit(page);
                }}
            />
            { produits.length > 0 && produitId !== null &&
                <EditerProduitModal
                isOpen={openEditerProduit}
                id = {produitId}
                onClose={() => {
                    setOpenEditerProduit(false);
                    recupProduit(page);
                }}
            />}
            { produits.length > 0 && produitId !== null &&  <SupprimerProduitModal
                isOpen={openSupprimerProduit}
                onClose={() => {
                    setOpenSupprimerProduit(false);
                    recupProduit(page);
                }} id={produitId} />}
        </div>
    );
}


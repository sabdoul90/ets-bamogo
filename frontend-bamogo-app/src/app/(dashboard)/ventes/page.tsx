"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, Pencil, Search } from "lucide-react";
import Link from "next/link";
import { formaterDate, formaterHeure } from "@/utils/date_heure_formateur";
import { venteService } from "@/services/vente.service";
import { Vente } from "@/type/vente.type";
import VenteModal from "@/components/dashboard/faireuneventemodal";
import SupprimerVenteModal from "@/components/ventes/supprimer";
import EditerVenteModal from "@/components/ventes/editer";
import { useRouter } from "next/navigation";



const MotionLink = motion.create(Link);

export default function VentesPage() {

    const [isMobile, setIsMobile] = useState(false);
    const [ventes, setVentes] = useState<Vente[]>([]);
    const [openAjouteVente, setOpenAjouteVente] = useState(false);
    const [openSupprimerVente, setOpenSupprimerVente] = useState(false);
    const [openEditerVente, setOpenEditerVente] = useState(false);
    const [venteId, setVenteId] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(1);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const recupVente = useCallback(async (page: number) => {


        const requete = await venteService.getAll(page, "client,media");
        /*console.log("vente requete");
        console.log(requete.data.data);
        console.log(requete.status);*/



        if (requete.status === 200) {
            setVentes(requete.data.data);
            setLimit(requete.data.pagination.pages);
        }
    }, []);

    const produitsfiltres = ventes.filter((p) =>
        p.client?.nom_prenom.toLowerCase().includes(search.toLowerCase()) || p.client?.telephone.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);

        check();
        window.addEventListener("resize", check);

        return () => window.removeEventListener("resize", check);
    }, []);


    useEffect(() => {
        recupVente(page);
    }, [recupVente, page]);

    return (
        <div className="p-4">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="titre-section-meduim text-(--texte-principal)">Les ventes</h1>

                <div className="flex gap-2">
                    {isMobile ? (
                        <button
                            onClick={() => router.push("/ventes/ajouter")}
                            className="bg-(--primary) text-(--blanc) px-4 py-2 rounded-full texte-normal-semi-bold hover:bg-(--btn-primaire-focus) transition-colors">
                            Faire une vente
                        </button>
                    ) : (
                        <button
                            onClick={() => setOpenAjouteVente(true)}
                            className="bg-(--primary) text-(--blanc) px-4 py-2 rounded-full texte-normal-semi-bold hover:bg-(--btn-primaire-focus) transition-colors">
                            Faire une vente
                        </button>
                    )}

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
                            <th className="py-2 text-left px-6">Montant</th>
                            <th className="py-2 text-left px-6">Nom client</th>
                            <th className="py-2 text-left px-6">Numero client</th>
                            <th className="py-2 text-left px-6">Date</th>
                            <th className="py-2 text-left px-6">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ventes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-(--gris)">
                                    Aucune vente disponible
                                </td>
                            </tr>
                        ) : (

                            produitsfiltres.length === 0 ?
                                ventes.map((v, index) => (
                                    <motion.tr
                                        key={v.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{Number(v.montant).toLocaleString("fr-FR")}</td>
                                        <td className="px-6 py-2">{v.client?.nom_prenom}</td>
                                        <td className="px-6 py-2">{v.client?.telephone}</td>
                                        <td className="px-6 py-2">{formaterDate(v.createdAt)} - {formaterHeure(v.createdAt)}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            <MotionLink
                                                href={`${process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA}${v.media?.url}`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Eye size={18} className="text-(--blanc)" />
                                            </MotionLink>

                                            <motion.button
                                                onClick={() => { setVenteId(v.id); setOpenSupprimerVente(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                            <motion.button
                                                onClick={() => { setVenteId(v.id); setOpenEditerVente(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Pencil size={18} className="text-(--blanc)" />
                                            </motion.button>

                                        </td>
                                    </motion.tr>
                                )) : produitsfiltres.map((v, index) => (
                                    <motion.tr
                                        key={v.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{Number(v.montant).toLocaleString("fr-FR")}</td>
                                        <td className="px-6 py-2">{v.client?.nom_prenom}</td>
                                        <td className="px-6 py-2">{v.client?.telephone}</td>
                                        <td className="px-6 py-2">{formaterDate(v.createdAt)} - {formaterHeure(v.createdAt)}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            <MotionLink
                                                href={`${process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA}${v.media?.url}`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Eye size={18} className="text-(--blanc)" />
                                            </MotionLink>

                                            <motion.button
                                                onClick={() => { setVenteId(v.id); setOpenSupprimerVente(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                            <motion.button
                                                onClick={() => { setVenteId(v.id); setOpenEditerVente(true); }}
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
                {ventes.length === 0 ? (
                    <div className="border border-(--bordure-color) rounded-xl p-6 text-center text-(--gris)">
                        Aucune vente disponible
                    </div>
                ) : (
                    ventes.map((v) => (
                        <div key={v.id} className="border border-(--bordure-color) hover:bg-(--bordure-color) rounded-xl p-3">
                            <div className="flex justify-between mb-2">
                                <div className="texte-normal-meduim flex flex-col text-(--texte-principal)">
                                    <span className="texte-normal-semi-bold ">{v.client?.nom_prenom}</span>
                                    <span className="texte-normal-semi-bold ">{v.client?.telephone}</span>
                                </div>
                                <span className="texte-normal-regular text-(--gris-facture)">{formaterDate(v.createdAt)} - {formaterHeure(v.createdAt)}</span>
                            </div>

                            <div className="texte-normal-bold text-(--texte-principal)">
                                <p>Montant: {Number(v.montant).toLocaleString("fr-FR")} FCFA</p>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <MotionLink
                                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA}${v.media?.url}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                    <Eye size={18} className="text-(--blanc)" />
                                </MotionLink>

                                <motion.button
                                    onClick={() => { setVenteId(v.id); setOpenSupprimerVente(true); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                    <Trash2 size={18} className="text-(--blanc)" />
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        router.push(`/ventes/editer?id=${v.id}`);
                                    }}
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
            <VenteModal
                isOpen={openAjouteVente}
                onClose={() => {
                    setOpenAjouteVente(false);
                    recupVente(page);
                }}
            />
            <SupprimerVenteModal
                isOpen={openSupprimerVente}
                onClose={() => {
                    setOpenSupprimerVente(false);
                    recupVente(page);
                }} id={venteId} />

            <EditerVenteModal
                isOpen={openEditerVente}
                onClose={() => {
                    setOpenEditerVente(false);
                    recupVente(page);
                }} id={venteId} />
        </div>
    );
}
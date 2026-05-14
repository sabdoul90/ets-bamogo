"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Search } from "lucide-react";
import { importService } from "@/services/import.service";
import AjouterImportModal from "@/components/imports/ajouter";
import { Import } from "@/type/import.type";
import SupprimerImportModal from "@/components/imports/supprimer";


export default function ImportsPage() {

    const [imports, setImports] = useState<Import[]>([]);
    const [openAjouterImport, setOpenAjouterImport] = useState(false);
    const [openSupprimerImport, setOpenSupprimerImport] = useState(false);
    const [importId, setImportId] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(1);
    const [search, setSearch] = useState("");

    const recupImports = useCallback(async (page: number) => {

        const requete = await importService.getAll(page);
        console.log("import requete");
        console.log(requete.data.data);
        console.log(requete.status);



        if (requete.status === 200) {
            setImports(requete.data.data);
            setLimit(requete.data.pagination.pages);
        }
    }, []);


    useEffect(() => {
        recupImports(page);
    }, [recupImports, page]);

    return (
        <div className="p-4 md:p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="titre-section-meduim text-(--texte-principal)">Les imports</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setOpenAjouterImport(true)}
                        className="bg-(--primary) text-(--blanc) px-4 py-2 rounded-full texte-normal-semi-bold hover:bg-(--btn-primaire-focus) transition-colors">
                        Ajouter un nouveau import
                    </button>
                </div>
            </div>



            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div></div>
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
                            <th className="py-2 text-left px-6">Titre</th>
                            <th className="py-2 text-left px-6">Type</th>
                            <th className="py-2 text-left px-6">Statut</th>
                            <th className="py-2 text-left px-6">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {imports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-(--gris)">
                                    Aucun import trouvé
                                </td>
                            </tr>
                        ) : (

                            
                                imports.map((i, index) => (
                                    <motion.tr
                                        key={i.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{i.titre}</td>
                                        <td className="px-6 py-2">{i.type}</td>
                                        <td className="px-6 py-2">{i.statut}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            

                                            <motion.button
                                                onClick={() => { setImportId(i.id); setOpenSupprimerImport(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                        </td>
                                    </motion.tr>
                                )) 
                        )
                        }
                    </tbody>
                </table>
            </div>


            <div className="md:hidden flex flex-col gap-3">
                {imports.length === 0 ? (
                    <div className="border border-(--bordure-color) rounded-xl p-6 text-center text-(--gris)">
                        Aucun import trouvé
                    </div>
                ) : (
                    imports.map((i) => (
                        <div key={i.id} className="border border-(--bordure-color) hover:bg-(--bordure-color) rounded-xl p-3">
                            <div className="flex justify-between mb-2">
                                <span className="texte-normal-semi-bold ">{i.titre}</span>
                                <span className="texte-normal-regular text-(--gris)">{i.type}</span>
                            </div>

                            <div className="flex gap-2 mt-3">

                                <motion.button
                                    onClick={() => { setImportId(i.id); setOpenSupprimerImport(true); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                    <Trash2 size={18} className="text-(--blanc)" />
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
            <AjouterImportModal
                isOpen={openAjouterImport}
                onClose={() => {
                    setOpenAjouterImport(false);
                    recupImports(page);
                }}
            />
            { imports.length > 0 && importId !== null &&  <SupprimerImportModal
                isOpen={openSupprimerImport}
                onClose={() => {
                    setOpenSupprimerImport(false);
                    recupImports(page);
                }} id={importId} />}
        </div>
    );
}


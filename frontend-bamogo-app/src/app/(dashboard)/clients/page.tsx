"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Search } from "lucide-react";
import { clientService } from "@/services/client.service";
import SupprimerClientModal from "@/components/clients/supprimer";
import AjouterClientModal from "@/components/clients/ajouter";
import { Client } from "@/type/client.type";
import EditerClientModal from "@/components/clients/editer";


export default function ClientsPage() {

    const [clients, setClients] = useState<Client[]>([]);
    const [openAjouterClient, setOpenAjouterClient] = useState(false);
    const [openSupprimerClient, setOpenSupprimerClient] = useState(false);
    const [openEditerClient, setOpenEditerClient] = useState(false);
    const [clientId, setClientId] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(1);
    const [search, setSearch] = useState("");

    const recupClient = useCallback(async (page: number) => {

        const requete = await clientService.getAll(page,10, "etablissement");
        console.log("client requete");
        console.log(requete.data.data);
        console.log(requete.status);



        if (requete.status === 200) {
            setClients(requete.data.data);
            setLimit(requete.data.pagination.pages);
        }
    }, []);

    const clientsfiltres = clients.filter((c) =>
        c.nom_prenom.toLowerCase().includes(search.toLowerCase())
    );


    useEffect(() => {
        recupClient(page);
    }, [recupClient, page]);

    return (
        <div className="p-4 md:p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h1 className="titre-section-meduim text-(--texte-principal)">Les clients</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setOpenAjouterClient(true)}
                        className="bg-(--primary) text-(--blanc) px-4 py-2 rounded-full texte-normal-semi-bold hover:bg-(--btn-primaire-focus) transition-colors">
                        Ajouter un nouveau client
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
                            <th className="py-2 text-left px-6">Nom et prénom</th>
                            <th className="py-2 text-left px-6">Numéro de téléphone</th>
                            <th className="py-2 text-left px-6">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-(--gris)">
                                    Aucun client trouvé
                                </td>
                            </tr>
                        ) : (

                            clientsfiltres.length === 0 ?
                                clients.map((c, index) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{c.nom_prenom}</td>
                                        <td className="px-6 py-2">{c.telephone}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            

                                            <motion.button
                                                onClick={() => { setClientId(c.id); setOpenSupprimerClient(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                            <motion.button
                                                onClick={() => { setClientId(c.id) ; setOpenEditerClient(true);}}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Pencil size={18} className="text-(--blanc)" />
                                            </motion.button>

                                        </td>
                                    </motion.tr>
                                )) : clientsfiltres.map((c, index) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"

                                    >
                                        <td className="px-6 py-2">{c.nom_prenom}</td>
                                        <td className="px-6 py-2">{c.telephone}</td>
                                        <td className="px-6 py-2 flex gap-2 justify-center">
                                            

                                            <motion.button
                                                onClick={() => { setClientId(c.id); setOpenSupprimerClient(true); }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={18} className="text-(--blanc)" />
                                            </motion.button>

                                            <motion.button
                                                onClick={() => { setClientId(c.id); setOpenEditerClient(true); }}
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
                {clients.length === 0 ? (
                    <div className="border border-(--bordure-color) rounded-xl p-6 text-center text-(--gris)">
                        Aucun client trouvé
                    </div>
                ) : (
                    clients.map((c) => (
                        <div key={c.id} className="border border-(--bordure-color) hover:bg-(--bordure-color) rounded-xl p-3">
                            <div className="flex justify-between mb-2">
                                <span className="texte-normal-semi-bold ">{c.nom_prenom}</span>
                                <span className="texte-normal-regular text-(--gris)">{c.telephone}</span>
                            </div>

                            <div className="flex gap-2 mt-3">

                                <motion.button
                                    onClick={() => { setClientId(c.id); setOpenSupprimerClient(true); }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                    <Trash2 size={18} className="text-(--blanc)" />
                                </motion.button>

                                <motion.button
                                    onClick={() => { setClientId(c.id); setOpenEditerClient(true); }}
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
            <AjouterClientModal
                isOpen={openAjouterClient}
                onClose={() => {
                    setOpenAjouterClient(false);
                    recupClient(page);
                }}
            />
            { clients.length > 0 && clientId !== null &&
                <EditerClientModal
                isOpen={openEditerClient}
                id = {clientId}
                onClose={() => {
                    setOpenEditerClient(false);
                    recupClient(page);
                }}
            />}
            { clients.length > 0 && clientId !== null &&  <SupprimerClientModal
                isOpen={openSupprimerClient}
                onClose={() => {
                    setOpenSupprimerClient(false);
                    recupClient(page);
                }} id={clientId} />}
        </div>
    );
}


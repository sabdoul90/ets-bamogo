"use client"

import { venteService } from "@/services/vente.service";
import { Vente } from "@/type/vente.type";
import { formaterDate, formaterHeure } from "@/utils/date_heure_formateur";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const MotionLink = motion.create(Link);

export default function DernieresVentes() {

    const [ventes, setVentes] = useState<Vente[]>([]);
    const [vide, setVide] = useState(false);

    const recupVente = useCallback(async (page: 1) => {

        const requete = await venteService.getAll(page, "client,media");
        console.log("vente requete");
        console.log(requete.data.data);
        console.log(requete.status);



        if (requete.status === 200) {
            if (requete.data.data.length === 0) {
                setVide(true);
            } else {
                localStorage.setItem("numero_facture",requete.data.data[0].id.toString());
                setVentes(requete.data.data);
            }
        }
    }, []);

    useEffect(() => {
        recupVente(1);
    }, [recupVente]);


    return (

        <div className="w-full mb-3">


            <div className="flex items-center justify-between mb-2">

                <h3 className="texte-normal-semi-bold text-(--texte-principal)">
                    Dernières ventes
                </h3>

                <Link href='/ventes' className="text-(--secondary) texte-normal-meduim hover:border-b border-(--secondary)">
                    voir tout
                </Link>

            </div>

            {
                vide == true && <h1 className="text-center text-(--texte-principal)"></h1>
            }


            {vide == false && <div className="overflow-x-auto border border-(--bordure-color) rounded-lg">

                <table className="w-full">

                    <thead className="bg-(--primary) text-(--blanc)">

                        <tr className="text-left">

                            <th className="px-6 py-2">Montant</th>
                            <th className="px-6 py-2">Nom client</th>
                            <th className="px-6 py-2">Numero client</th>
                            <th className="px-6 py-2">Date</th>
                            <th className="px-6 py-2 text-center">Facture</th>

                        </tr>

                    </thead>

                    <tbody>

                        {ventes.map((vente, index) => (

                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-(--bordure-color) hover:bg-(--bordure-color)"
                            >

                                <td className="px-6 py-2">{Number(vente.montant).toLocaleString("fr-FR")}</td>

                                <td className="px-6 py-2">{vente.client?.nom_prenom}</td>

                                <td className="px-6 py-2">{vente.client?.telephone}</td>

                                <td className="px-6 py-2">{`${formaterDate(vente.createdAt)} - ${formaterHeure(vente.createdAt)}`}</td>

                                <td className="px-6 py-2 flex justify-center">

                                    <MotionLink
                                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA}${vente.media?.url}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-(--primary) hover:bg-(--btn-primaire-focus) w-9 h-9 rounded-full flex items-center justify-center"
                                    >
                                        <Eye size={18} className="text-(--blanc)" />
                                    </MotionLink>

                                </td>

                            </motion.tr>

                        ))}

                    </tbody>

                </table>

            </div>}

        </div>

    )

}
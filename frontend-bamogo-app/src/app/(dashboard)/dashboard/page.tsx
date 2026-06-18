"use client";
import StatsCard from "@/components/dashboard/statscard";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import DernieresVentes from "@/components/dashboard/dernieresventes";
import RuptureTable from "@/components/dashboard/rupturestock";
import VenteModal from "@/components/dashboard/faireuneventemodal";
import AjouterProduitModal from "@/components/dashboard/ajouterproduit";
import { Stat } from "@/type/stat.type";
import { statsService } from "@/services/stats.service";
import { useRouter } from "next/navigation";

const MotionLink = motion.create(Link);

type Tab = "ventes" | "ruptures";


export default function DashboardPage() {

    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();


    const [activeTab, setActiveTab] = useState<Tab>("ventes");
    const [isSticky, setIsSticky] = useState(false);

    const [stats, setStats] = useState<Stat[]>([]);

    const [open, setOpen] = useState(false);
    const [openAjouterProduit, setOpenAjouterProduit] = useState(false);


    const recupStats = useCallback(async () => {

        const requete = await statsService.get();
        console.log("Stats requete");
        console.log(requete.data.data);
        console.log(requete.status);



        if (requete.status === 200) {
            setStats(requete.data.data);
        }
    }, []);

    useEffect(() => {
        recupStats();
    }, [recupStats]);




    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);

        check();
        window.addEventListener("resize", check);

        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {

        const container = scrollRef.current;

        const handleScroll = () => {
            if (!container) return;

            if (container.scrollTop > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        container?.addEventListener("scroll", handleScroll);

        return () => container?.removeEventListener("scroll", handleScroll);

    }, []);

    return (

        <div
            ref={scrollRef}
            className="flex flex-col mx-3 md:mx-10 h-screen overflow-y-auto no-scrollbar">

            <h2 className="titre-section-meduim text-(--texte-principal) mt-5 mb-3.5">
                Dashboard
            </h2>

            <motion.div
                animate={{ opacity: isSticky ? 0 : 1, y: isSticky ? -30 : 0 }}
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full"
            >

                {stats.length > 0 ?
                    stats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            nom={stat.nom}
                            valeur={stat.valeur}
                        />
                    )) :
                    <><StatsCard nom="Produits" valeur={0} />
                        <StatsCard nom="Clients" valeur={0} />
                        <StatsCard nom="Ventes" valeur={0} />
                    </>
                }

            </motion.div>

            <motion.div
                animate={{ opacity: isSticky ? 0 : 1, y: isSticky ? -30 : 0 }}
            >
                <h2 className="titre-section-meduim text-(--texte-principal) mt-5 mb-3.5">
                    Accès rapide
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full mb-5">
                    {isMobile ? (<motion.button
                        onClick={() => router.push("/ventes/ajouter")}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="texte-normal-meduim px-8 py-2 border border-(--bordure-color) rounded-3xl hover:bg-(--bordure-color)"
                    >
                        Faire une vente
                    </motion.button>) :
                        (<motion.button
                            onClick={() => setOpen(true)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="texte-normal-meduim px-8 py-2 border border-(--bordure-color) rounded-3xl hover:bg-(--bordure-color)"
                        >
                            Faire une vente
                        </motion.button>)

                    }

                    <motion.button
                        onClick={() => setOpenAjouterProduit(true)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="texte-normal-meduim px-8 py-2 border border-(--bordure-color) rounded-3xl hover:bg-(--bordure-color)"
                    >
                        Ajouter un produit
                    </motion.button>

                    <MotionLink
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        href="/ventes"
                        className="texte-normal-meduim px-8 py-2 border border-(--bordure-color) rounded-3xl hover:bg-(--bordure-color)"
                    >
                        Voir les ventes
                    </MotionLink>
                </div>
            </motion.div>

            <div
                className={`w-full z-10 transition-all
                ${isSticky ? "sticky top-0" : "relative"}
                `}
            >

                <nav className="flex gap-6 md:gap-10 py-1">

                    <button
                        onClick={() => setActiveTab("ventes")}
                        className={`pb-2 transition
                        ${activeTab === "ventes"
                                ? "border-b-2 titre-section-bold  text-(--primary) border-(--primary)"
                                : "titre-section-meduim text-(--texte-principal)"
                            }`}
                    >
                        Ventes
                    </button>

                    <button
                        onClick={() => setActiveTab("ruptures")}
                        className={`pb-2 transition
                        ${activeTab === "ruptures"
                                ? "border-b-2 titre-section-bold  text-(--primary) border-(--primary)"
                                : "titre-section-meduim text-(--texte-principal)"
                            }`}
                    >
                        Produits en rupture de stock
                    </button>

                </nav>

            </div>

            <div className="mt-6 w-full">

                {activeTab === "ventes" && (
                    <div>
                        <DernieresVentes />
                    </div>
                )}

                {activeTab === "ruptures" && (
                    <div>
                        <RuptureTable />
                    </div>
                )}

            </div>

            <VenteModal
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            <AjouterProduitModal
                isOpen={openAjouterProduit}
                onClose={() => { setOpenAjouterProduit(false); }}
            />

        </div>
    );
}
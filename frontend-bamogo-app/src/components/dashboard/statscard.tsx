"use client";

import { Package, Users, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Stat } from "@/type/stat.type";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

const Icones: Record<string, LucideIcon> = {
    Produits: Package,
    Clients: Users,
    Ventes: TrendingUp
};

export default function StatsCard({ nom, valeur }: Stat) {

    const Icon = Icones[nom];

    const count = useMotionValue(0);
    const [display, setDisplay] = useState(0);

    useEffect(() => {

        const controls = animate(count, valeur, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate(latest) {
                setDisplay(Math.floor(latest));
            }
        });

        return controls.stop;

    }, [valeur]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="stats-card flex flex-col items-center justify-center h-36 w-full md:w-48 border border-(--bordure-color) rounded-lg"
        >

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-(--primary) flex items-center justify-center w-10 h-10 p-2.5 rounded-full mb-1"
            >
                {Icon && (
                    <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="text-(--blanc)"
                    />
                )}
            </motion.div>

            <h2 className="text-principal-bold text-(--texte-principal) mb-2">
                {Number(display).toLocaleString("fr-FR")}
            </h2>

            <h2 className="texte-normal-meduim text-(--texte-principal) mb-2.5">
                {nom}
            </h2>

        </motion.div>
    );
}
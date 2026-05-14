"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Error500Page() {
    

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-(--background)">

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center pt-6 md:pt-12 px-3.5 md:px-28 "
            >

                
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className=" text-500-bold text-(--primary) mb-4"
                >
                    500
                </motion.h1>

                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="texte-normal-regular text-center text-(--noir) mb-6"
                >
                    Une erreur interne du serveur est survenue.
                    <br />
                    Veuillez réessayer plus tard.
                </motion.p>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex w-full gap-3 items-end justify-end"
                >

                    <Link
                        href="/"
                        className="mb-5 px-4 py-1 text-(--noir) hover:text-(--secondary) hover:border-b hover:border-(--secondary) transition"
                    >
                        Page de connexion
                    </Link>
                </motion.div>

            </motion.div>

        </div>
    );
}
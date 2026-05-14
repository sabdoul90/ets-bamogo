"use client";


import { LoginPayload } from "@/type/auth.type";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexte/authContext";
import { Eye, EyeClosed } from "lucide-react";



export default function LoginPage() {
    const { login, error, isLoading, success, setIsLoading, setError, status } = useAuth();

    const [visible, setVisible] = useState(false);  

    const [form, setForm] = useState<LoginPayload>({
        telephone: "",
        mot_de_passe: ""
    });

    const gestionSaisie = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };




    const action = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(form);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
    };

    return (

        <div className="flex items-center justify-center w-screen h-screen bg-background">

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center pt-6 md:pt-12 px-3.5 md:px-28 border border-(--bordure-color) rounded-lg"
            >

                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="titre-section-bold md:text-principal-bold mb-3 md:mb-6"
                >
                    ETS BAMOGO MADI & FRERES
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "9rem" }}
                    transition={{ delay: 0.3 }}
                    className="md:w-36 w-10 h-px bg-(--bordure-color) mb-2.5 md:mb-5"
                />

                <motion.form
                    variants={container}
                    initial="hidden"
                    animate="show"
                    onSubmit={action}
                    className="flex flex-col items-center"
                >

                    <motion.div
                        variants={item}
                        className="flex flex-col items-start"
                    >
                        <label className="label-formulaire-regular mb-1 md:mb-2">
                            Numero de telephone
                        </label>

                        <input
                            value={form.telephone}
                            name="telephone"
                            onChange={(e) => gestionSaisie(e)}
                            className="saisie mb-2.5 px-4 md:mb-5 outline-none focus:ring-1 focus:ring-(--primary)"
                            placeholder="Entrez votre numéro de telephone"
                        />
                    </motion.div>

                    <motion.div
                        variants={item}
                        className="flex flex-col items-start"
                    >
                        <label className="label-formulaire-regular mb-1 md:mb-2">
                            Mot de passe
                        </label>

                        <div className="relative">
                            <input
                                type={visible == true ? "text" : "password"}
                                name="mot_de_passe"
                                value={form.mot_de_passe}
                                onChange={(e) => gestionSaisie(e)}
                                className="saisie px-4 mb-5 outline-none focus:ring-1 focus:ring-(--primary)"
                                placeholder="Entrez votre mot de passe"
                            />
                            {visible && <Eye onClick={() => setVisible(false)} size={24} className="absolute right-3 top-2.5 text-(--gris)" />}
                            {!visible && <EyeClosed onClick={() => setVisible(true)} size={24} className="absolute right-3 top-2.5 text-(--gris)" />}
                        </div>


                    </motion.div>

                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-login px-24 py-2.5 text-(--blanc) mb-20"
                    >
                        Se connecter
                    </motion.button>

                    {error && (
                        <motion.div className={`mb-4 p-3 ${success == true ? "bg-(--success-dilue) border border-(--success) " : "bg-(--erreur-dilue) border border-(--erreur) "} text-(--noir)  rounded`}>
                            {error}
                        </motion.div>
                    )}

                </motion.form>

            </motion.div>

        </div>
    );
}
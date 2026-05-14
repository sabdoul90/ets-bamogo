"use client";

import Modal from "../dashboard/modal";
import { X } from "lucide-react";
import { useState } from "react";
import { clientService } from "@/services/client.service";
import { useAuth } from "@/contexte/authContext";
import { u } from "framer-motion/client";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    nom_prenom: string;
    telephone: string,
    id_etablissement: number
};


export default function AjouterClientModal({ isOpen, onClose }: Props) {
    const { utilisateur } = useAuth();

    const [form, setForm] = useState<FormData>({
        nom_prenom: "",
        telephone: "",
        id_etablissement: 1
    });

    const gestionSaisie = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const [success, setSuccess] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");


    const resetForm = () => {
        setForm(
            {
                nom_prenom: "",
                telephone: "",
                id_etablissement: utilisateur?.etablissement?.id ?? 1
            }
        );
    };

    const handleClose = () => {
        resetForm();
        setSuccess(false);
        setError("");
        onClose();
    };


    const action = async (e: React.FormEvent) => {
        e.preventDefault();


        try {


            setIsLoading(true);
            setError("");


            const clientRequete = await clientService.post(
                form
            );

            if (clientRequete.status === 201) {

                setError("Client enregistré avec succès");
                setIsLoading(false);
                setSuccess(true);

            };




        } catch (err: any) {
            setError("Erreur lors de l'enregistrement du client");
            setIsLoading(false);
            setSuccess(false);
        }
    };






    return (
        <Modal isOpen={isOpen} onClose={handleClose}>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-principal-semi-bold">Ajouter un client</h2>
                <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            <form className="flex flex-col" onSubmit={action}>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label htmlFor="nom_prenom" className="block text-sm font-medium mb-1">Nom et prénom</label>
                        <input
                            id="nom_prenom"
                            type="text"
                            name="nom_prenom"
                            value={form.nom_prenom}
                            onChange={(e) => gestionSaisie(e)}
                            placeholder="Nom et prenom du client"
                            className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-sm font-medium mb-1">Numéro de téléphone</label>
                        <input
                            id="telephone"
                            type="text"
                            name="telephone"
                            value={form.telephone}
                            onChange={(e) => gestionSaisie(e)}
                            placeholder="Numéro de téléphone"
                            className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                    </div>
                </div>

                {error && (
                    <div className={`mb-4 p-3 ${success == true ? "bg-(--success-dilue) border border-(--success) " : "bg-(--erreur-dilue) border border-(--erreur) "} text-(--noir)  rounded`}>
                        {error}
                    </div>
                )}

                <div className="flex justify-end items-center">


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-(--info) text-(--blanc) px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--btn-primaire) transition-colors"
                    >
                        {isLoading ? "Enregistrement..." : "Enregistrer le client"}
                    </button>
                </div>
            </form>

        </Modal>
    );
}
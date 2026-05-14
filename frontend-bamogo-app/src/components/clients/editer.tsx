"use client";


import Modal from "../dashboard/modal";
import { X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { clientService } from "@/services/client.service";
import { Client } from "@/type/client.type";

interface Props {
    id: number;
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    nom_prenom: string;
    telephone: string,
    id_etablissement: 1
};


export default function EditerClientModal({ id, isOpen, onClose }: Props) {


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
    const [client, setClient] = useState<Client | null>(null);


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");


    const resetForm = () => {
        setForm(
            {
                nom_prenom: "",
                telephone: "",
                id_etablissement: 1
            }
        );
    };

    const handleClose = () => {
        resetForm();
        setError("");
        setSuccess(false);
        onClose();
    };


    const action = async (e: React.FormEvent) => {
        e.preventDefault();


        try {


            setIsLoading(true);
            setError("");


            const venteproduitRequete = await clientService.update(
                id,
                form
            );

            if (venteproduitRequete.status === 200) {

                setError("Modification enregistrée avec succès");
                setIsLoading(false);
                setSuccess(true);

            };




        } catch (err: any) {
            setError("Erreur lors de l'enregistrement du produit");
            setIsLoading(false);
            setSuccess(false);
        }
    };

    const recupClient = useCallback(async (id: number) => {

        const requete = await clientService.getById(id);

        console.log("Requete numero editer: ", id);

        if (requete.status === 200) {
            setClient(requete.data.data);
            setForm({
                nom_prenom: requete.data.data.nom_prenom,
                telephone: requete.data.data.telephone,
                id_etablissement : 1
            });
        } else {
            setError(requete.data.data.message);
            console.log("message ", requete);
        }
    }, []);


    useEffect(() => {
        recupClient(id);
    }, [recupClient, id]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-principal-semi-bold">Editer les informations d'un client</h2>
                <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            <form className="flex flex-col" onSubmit={action}>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label htmlFor="nom" className="block text-sm font-medium mb-1">Nom du produit</label>
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
                        {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                    </button>
                </div>
            </form>

        </Modal>
    );
}
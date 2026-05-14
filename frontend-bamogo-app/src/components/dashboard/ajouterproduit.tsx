"use client";

import Modal from "./modal";
import { X } from "lucide-react";
import { useState, useEffect, UIEvent, ChangeEvent, useCallback } from "react";
import { produitService } from "@/services/produit.service";
import { useAuth } from "@/contexte/authContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    nom: string;
    quantite_stock: number,
    prix_unitaire: number,
    id_etablissement: number
};


export default function AjouterProduitModal({ isOpen, onClose }: Props) {
    const { utilisateur} = useAuth();


    const [form, setForm] = useState<FormData>({
        nom: "",
        quantite_stock: 0,
        prix_unitaire: 0,
        id_etablissement: utilisateur?.etablissement?.id ?? 1,
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
                nom: "".toUpperCase(),
                quantite_stock: 0,
                prix_unitaire: 0,
                id_etablissement: 1
            }
        );
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };


    const action = async (e: React.FormEvent) => {
        e.preventDefault();


        try {


            setIsLoading(true);
            setError("");


            const venteproduitRequete = await produitService.post(
                form
            );

            if (venteproduitRequete.status === 201) {

                setError("Produit enregistré avec succès");
                setIsLoading(false);
                setSuccess(true);

            };




        } catch (err: any) {
            setError("Erreur lors de l'enregistrement du produit");
            setIsLoading(false);
            setSuccess(false);
        }
    };






    return (
        <Modal isOpen={isOpen} onClose={handleClose}>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-principal-semi-bold">Ajouter un produit</h2>
                <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            <form className="flex flex-col" onSubmit={action}>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label htmlFor="nom" className="block text-sm font-medium mb-1">Nom du produit</label>
                        <input
                            id="nom"
                            type="text"
                            name="nom"
                            value={form.nom}
                            onChange={(e) => gestionSaisie(e)}
                            placeholder="Nom du produit"
                            className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                    </div>
                    <div>
                        <label htmlFor="quantite" className="block text-sm font-medium mb-1">Quantité en stock</label>
                        <input
                            id="quantite"
                            type="number"
                            name="quantite_stock"
                            value={form.quantite_stock}
                            onChange={(e) => gestionSaisie(e)}
                            placeholder="Quantité en stock"
                            className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="prix" className="block text-sm font-medium mb-1">Prix unitaire</label>
                    <div className="relative">
                        <input
                            id="prix"
                            name="prix_unitaire"
                            type="number"
                            value={form.prix_unitaire}
                            onChange={(e) => gestionSaisie(e)}
                            placeholder="Prix unitaire"
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
                        {isLoading ? "Enregistrement..." : "Enregistrer le produit"}
                    </button>
                </div>
            </form>




        </Modal>
    );
}
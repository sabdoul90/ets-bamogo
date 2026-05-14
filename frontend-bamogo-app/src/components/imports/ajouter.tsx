
"use client";

import Modal from "../dashboard/modal";
import { X } from "lucide-react";
import { useState } from "react";
import { importService } from "@/services/import.service";
import { mediaService } from "@/services/media.service";
import { Media } from "@/type/media.type";
import { useAuth } from "@/contexte/authContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    titre: string;
    type: string,
    id_etablissement: number
};


export default function AjouterImportModal({ isOpen, onClose }: Props) {
    const { utilisateur } = useAuth();

    const [form, setForm] = useState<FormData>({
        titre: "",
        type: "",
        id_etablissement: utilisateur?.etablissement?.id ?? 1,
    });

    const [fichier, setFichier] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("Aucun fichier choisi");

    const gestionSaisie = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };


    const [success, setSuccess] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");


    const resetForm = () => {
        setForm(
            {
                titre: "",
                type: "",
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

        let media: Media;


        try {


            setIsLoading(true);
            setError("");


            if (fichier) {
                const data = new FormData();
                data.append("file", fichier);

                const uplad = await mediaService.post(data);


                if (uplad.status === 201) {
                    //console.log("Media créé avec succès : ", uplad.data.data.id);
                    media = uplad.data.data;
                    //console.log("Media créé avec succès : ", uplad.data.data);
                } else {
                    setError(uplad.data.data.message || "Erreur lors de la création du media");
                    setIsLoading(false);
                }
            }


            const importRequete = await importService.post(
                {
                    ...form,
                    id_media: media!.id
                }
            );

            if (importRequete.status === 201) {

                setError("Import enregistré avec succès");
                setIsLoading(false);
                setSuccess(true);

            };




        } catch (err: any) {
            setError("Erreur lors de l'enregistrement de l'import");
            setIsLoading(false);
            setSuccess(false);
        }
    };


    const gererFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        const file = files[0];
        console.log(file);
        setFichier(file);
        if (file) {
            setFileName(file.name);
        }
    };



    return (
        <Modal isOpen={isOpen} onClose={handleClose}>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-principal-semi-bold">Ajouter un import</h2>
                <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            <form className="flex flex-col" onSubmit={action}>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label htmlFor="titre" className="block text-sm font-medium mb-1">Titre de l'import</label>
                        <input
                            id="titre"
                            type="text"
                            name="titre"
                            value={form.titre}
                            onChange={(e) => gestionSaisie(e)}
                            placeholder="Titre de l'import"
                            className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-1">Type de l'import</label>
                        <select
                            id="type"
                            name="type"
                            value={form.type}
                            onChange={(e) => gestionSaisie(e)}
                            className="saisie px-2 texte-normal-regular border border-(--bordure-color) rounded-md outline-none focus:ring-1 focus:ring-(--primary)"
                        >
                            <option value="">---</option>
                            <option value="produits">Import de produits</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="media" className="block text-sm font-medium mb-1">Fichier</label>

                    <div className="flex items-center gap-3">

                        <label className="cursor-pointer bg-(--primary) text-(--blanc) px-4 py-2 rounded-md hover:bg-(--secondary) transition">
                            Choisir un fichier
                            <input
                                type="file"
                                onChange={gererFichier}
                                className="hidden"
                            />
                        </label>


                        <span className="texte-normal-regular text-gray-600 truncate">
                            {fileName}
                        </span>
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
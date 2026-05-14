"use client";


import Modal from "../dashboard/modal";
import { X } from "lucide-react";
import { useState} from "react";
import { venteService } from "@/services/vente.service";

interface Props {
    id: number;
    isOpen: boolean;
    onClose: () => void;
}



export default function SupprimerVenteModal({ id, isOpen, onClose }: Props) {




    const [success, setSuccess] = useState(false);



    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");



    const handleClose = () => {
        onClose();
    };


    const action = async (e: React.FormEvent) => {
        e.preventDefault();


        try {


            setIsLoading(true);
            setError("");


            const venteproduitRequete = await venteService.delete(id);

            if (venteproduitRequete.status === 200) {

                setError("Vente supprimée avec succès");
                setIsLoading(false);
                setSuccess(true);

            };




        } catch (err: any) {
            setError("Erreur lors de la suppression de la vente");
            setIsLoading(false);
            setSuccess(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={handleClose}>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-principal-semi-bold">Supprimer une vente</h2>
                <button className="rounded-full hover:text-(--secondary) flex items-center justify-center w-8 h-8 border border-(--bordure-color) hover:border-(--secondary)" onClick={handleClose}>
                    <X size={22} />
                </button>
            </div>

            <div className="flex flex-col">

                

                <div className={`mb-4 p-3 titre-section-meduim text-(--noir)`}>
                        Voulez-vous vraiment supprimer cette vente ?
                    </div>



                {error && (
                    <div className={`mb-4 p-3 ${success == true ? "bg-(--success-dilue) border border-(--success) " : "bg-(--erreur-dilue) border border-(--erreur) "} text-(--noir)  rounded`}>
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-5 items-center">


                    <button
                        onClick={() => {
                            handleClose()
                         }}
                        disabled={isLoading}
                        className="bg-(--info) text-(--blanc) px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--btn-primaire) transition-colors"
                    >
                        {"Annuler"}
                    </button>

                    <button

                        onClick={(e) => action(e)}
                        disabled={isLoading}
                        className="bg-(--alerte) text-(--blanc) px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--btn-primaire) transition-colors"
                    >
                        {isLoading ? "Suppression..." : "Supprimer la vente"}
                    </button>
                </div>
            </div>

        </Modal>
    );
}
"use client";

import { Produit } from "@/type/produit.type";
import { useState, useEffect, UIEvent, ChangeEvent, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { produitService } from "@/services/produit.service";
import { VenteProduit } from "@/type/venteproduit.type";
import { Client } from "@/type/client.type";
import { clientService } from "@/services/client.service";
import { venteService } from "@/services/vente.service";
import { genererPDF } from "@/utils/genererpdf";
import { mediaService } from "@/services/media.service";
import { Vente } from "@/type/vente.type";
import { Media } from "@/type/media.type";
import { venteproduitService } from "@/services/venteproduit.service";
import { useAuth } from "@/contexte/authContext";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import EditerPage from "@/components/ventes/editerVentePage";


export default function Editer() {

    return (
        <Suspense
            fallback={
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div className="rounded-2xl shadow-xl bg-(--blanc) px-6 py-4">
                        Chargement...
                    </div>
                </div>
            }
        >
            <EditerPage />
        </Suspense>
    );
}

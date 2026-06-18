import { User } from "lucide-react"
import { useAuth } from "@/contexte/authContext";
import { useEffect, useState } from "react";


export default function Header() {

  const { utilisateur, isLoading } = useAuth();

  // 🔥 Détection mobile runtime
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // 🎯 Classes dynamiques selon device
  const titleClass = isMobile ? "texte-normal-semi-bold" : "titre-section-bold";

  const userClass = isMobile ? "texte-normal-semi-bold" : "titre-section-bold";

  return (
    <header className="h-16 w-full px-4 sm:px-6 flex items-center justify-between border-b border-(--bordure-color)">

      {/* INSTITUTION */}
      <h1 className={`text-(--texte-principal) ${titleClass}`}>
        ETS TRAORE & FRERES
      </h1>

      {/* USER */}
      <div className="flex items-center gap-3">

        <h2
          className={`text-(--texte-principal) ${userClass} truncate max-w-40`}
        >
          {utilisateur ? `${utilisateur.nom} ${utilisateur.prenom}` : ""}
        </h2>

        {/* ICON CIRCLE FIX */}
        <div className="flex m-2 items-center justify-center w-10 h-10 shrink-0 rounded-full bg-(--gris)">
          <User size={18} strokeWidth={2} className="text-(--noir)" />
        </div>

      </div>

    </header>
  );
}
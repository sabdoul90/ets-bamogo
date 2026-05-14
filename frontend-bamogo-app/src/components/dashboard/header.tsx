import { User } from "lucide-react"
import { useAuth } from "@/contexte/authContext";
export default function Header() {

  const { utilisateur, isLoading } = useAuth();
  
  
      if(isLoading === true) {
          return (
              <div className="flex items-center justify-center h-screen">
                  <p>Chargement en cours...</p>
              </div>
          );
      }
  return (
    <header className="h-16 w-full p-2.5 flex items-center justify-between border-b border-(--bordure-color)">

      <h1 className="text-(--texte-principal) titre-section-bold px-6">
        ETS BAMOGO MADI & FRERES
      </h1>

      <div className="flex items-center px-6 gap-3">

        <h2 className="text-(--texte-principal) texte-normal-medium">
          {utilisateur ? `${utilisateur.nom}  ${utilisateur.prenom}` : ""}
        </h2>

        <div className="rounded-full h-10 w-10 bg-(--gris) flex items-center justify-center">
          <User size={22} strokeWidth={1.5} className="text-(--noir)" />
        </div>

      </div>

    </header>
  )
}
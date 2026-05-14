"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { Utilisateur } from "@/type/user.type";
import { usePathname } from "next/navigation";

type AuthContextType = {
    utilisateur: Utilisateur | null;
    setUtilisateur: (user: Utilisateur | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    error: string;
    status: number | null;
    setStatus: (success: number) => void;
    setError: (error: string) => void;
    success: boolean,
    setSuccess: (success: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: any) => {
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [status, setStatus] = useState<number | null>(null);
    const router = useRouter();

    

const pathname = usePathname();



    const recupererUtilisateur = async () => {
        try {
            console.log("Récupération de l'utilisateur en cours...");
            setIsLoading(true);

            const authResponse = await authService.me();

            console.log("Auth response = ", authResponse.data.data);

            if (authResponse.status === 200) {
                setUtilisateur(authResponse.data.data);
                setStatus(authResponse.status);
            } else {
                setUtilisateur(null);
            }
        } catch (error) {
            console.error("Erreur:", error);
            setUtilisateur(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: any) => {
        try {

            console.log("Données de connexion = ", data);

            setIsLoading(true);

            const UtilisateurRequete = await authService.login(
                {
                    "telephone": data.telephone,
                    "mot_de_passe": data.mot_de_passe
                }
            );

            console.log("Utilisateur requete login = ", UtilisateurRequete.data.data.utilisateur);
        

            if (UtilisateurRequete.status === 200) {
        

                setUtilisateur(UtilisateurRequete.data.data.utilisateur);
                setStatus(UtilisateurRequete.status);

                setError("Connexion réussie !");
                setIsLoading(false);
                setSuccess(true);
                router.push("/dashboard");

            }else{
                setError(UtilisateurRequete.data.data.message);
                setIsLoading(false);
                setSuccess(false);
            };

        } catch (err: any) {
            console.error("Erreur lors de la connexion:", err);
            setError(err.data?.data?.message || "Erreur lors de la connexion");
            setIsLoading(false);
            setSuccess(false);
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true);
            const logoutResponse = await authService.logout();
            if (logoutResponse.status === 200) {
                setUtilisateur(null);
                router.push("/login");
            }
        }
        catch (err) {
            setError("Erreur lors de la déconnexion");
            setIsLoading(false);
            setSuccess(false);
        }
    };

    useEffect(() => {
    
    if (pathname === "/login") {
        setIsLoading(false);
        return;
    }

    /*if (pathname === "/dashboard") {
        setIsLoading(false);
        return;
    }

    if (pathname === "/clients") {
        setIsLoading(false);
        return;
    }

    if (pathname === "/ventes") {
        setIsLoading(false);
        return;
    }

    if (pathname === "/imports") {
        setIsLoading(false);
        return;
    }

    if (pathname === "/produits") {
        setIsLoading(false);
        return;
    }

    if (pathname === "/500") {
        setIsLoading(false);
        return;
    }*/

    recupererUtilisateur();
}, [pathname]);

    return (
        <AuthContext.Provider value={{ utilisateur, setUtilisateur, isLoading, setIsLoading, login, logout, error, setError, success, setSuccess, setStatus, status }}>
            {children}
        </AuthContext.Provider>
    );
};


"use client"

import { useAuth } from "@/contexte/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const { utilisateur, isLoading } = useAuth();

  const router = useRouter();


  useEffect(() => {
    if (isLoading) return;

    if (!utilisateur) {
      if (pathname !== "/login") {
        router.push("/login");
      }

    } else {
      router.push("/dashboard");
    }
  }, [isLoading, utilisateur]);

  if (isLoading === true) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement en cours...</p>
      </div>
    );
  }
}
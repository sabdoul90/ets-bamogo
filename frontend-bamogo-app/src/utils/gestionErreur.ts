export function handleError(error: any): string {
  if (!error) return "Erreur inconnue";

  switch (error.status) {
    case 400:
      return "Requête invalide";
    case 401:
      return "Non autorisé";
    case 404:
      return "Introuvable";
    case 500:
      return "Erreur serveur";
    default:
      return error?.data?.message || "Erreur";
  }
}
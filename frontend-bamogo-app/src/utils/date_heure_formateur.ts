
export function formaterHeure(datevalue:string) : string {
    const date = new Date(datevalue);

    const heures = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const heureFormatee = `${heures}h${minutes}`;
    return `${heureFormatee}`;
}


export function formaterDate(datevalue:string) : string {
    const date = new Date(datevalue);

    const moisNoms = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    const jour = date.getDate();
    const mois = moisNoms[date.getMonth()];
    const annee = date.getFullYear();

    return `${jour} ${mois} ${annee}`;
}
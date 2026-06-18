import { Client } from "@/type/client.type";
import { VenteProduit } from "@/type/venteproduit.type";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

// ===== NUMEROTATION =====
const getNextInvoiceNumber = (): string => {
    const key = "numero_facture";
    const current = localStorage.getItem(key);
    const next = current ? parseInt(current) + 1 : 1;
    localStorage.setItem(key, next.toString());
    return next.toString().padStart(5, "0");
};

// ===== LOAD IMAGE =====
const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d")?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = reject;
    });
};

export const genererPDF = async (
    client: Client,
    selection: VenteProduit[],
    total: number
): Promise<File> => {

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== LOAD IMAGES =====
    const etoile = await loadImageAsBase64("/images/yuxing.png");
    const sac = await loadImageAsBase64("/images/cereales.png");
    const logoRouge = await loadImageAsBase64("/images/sr.png");
    const yamaha = await loadImageAsBase64("/images/yamaha.png");

    // =========================
    // 🔥 LOGOS BIEN ALIGNÉS
    // =========================

    const leftX = 14;
    const rightX = pageWidth - 14 - 28;

    const topY = 10;
    const gap = 4;

    // Gauche (alignés verticalement)
    doc.addImage(etoile, "PNG", leftX, topY, 28, 22);
    doc.addImage(sac, "PNG", leftX, topY + 18 + gap, 24, 22);

    // Droite (alignés verticalement)
    doc.addImage(logoRouge, "PNG", rightX, topY, 22, 18);
    doc.addImage(yamaha, "PNG", rightX, topY + 14 + gap, 24, 18);

    // =========================
    // 🔥 HEADER CENTRÉ PROPRE
    // =========================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("ETS BAMOGO MADI & FRERES", pageWidth / 2, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("COMMERCE GENERAL", pageWidth / 2, 24, { align: "center" });

    doc.text(
        "VENTE DE PRODUITS DIVERS, CEREALES, PIECES DETACHEES",
        pageWidth / 2,
        29,
        { align: "center" }
    );

    doc.text("ESSAKANE SECTEUR 3", pageWidth / 2, 34, { align: "center" });

    doc.text(
        "Tél : (+226) 72 12 22 11 / 76 91 65 21 / 78 81 21 65",
        pageWidth / 2,
        39,
        { align: "center" }
    );

    // =========================
    // 🔥 LIGNE BIEN POSITIONNÉE
    // =========================

    const lineY = 55;
    
    /*
    doc.setDrawColor(150);
    doc.setLineWidth(0.2);
    doc.line(14, lineY, pageWidth - , lineY);
    */

    doc.line(14, lineY, 196, lineY);

    // =========================
    // FACTURE
    // =========================

    const numero = getNextInvoiceNumber();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`FACTURE N°${numero}`, 14, lineY + 10);

    const today = new Date();
    const date = `${today.getDate()} ${today.toLocaleString("fr-FR", {
        month: "long",
    })} ${today.getFullYear()}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(date, 14, lineY + 16);
    doc.text(`Nom & Prénom : ${client.nom_prenom}`, 14, lineY + 22);

    // =========================
    // TABLE
    // =========================

    const tableData = selection
        .filter((p) => p.produit?.nom)
        .map((p) => {
            const prix =
                (p as any).cout_unitaire ?? p.produit?.prix_unitaire ?? 0;
            const qte = p.quantite ?? 0;

            return [
                p.produit?.nom || "N/A",
                qte.toString(),
                `${Number(prix).toLocaleString("fr-FR").replace(/\u202F/g, " ")} F CFA`,
                `${Number(prix * qte).toLocaleString("fr-FR").replace(/\u202F/g, " ")} F CFA`,
            ];
        });

    autoTable(doc, {
        startY: lineY + 30,
        head: [["DESIGNATION", "QUANTITE", "PRIX UNITAIRE", "PRIX TOTAL"]],
        body: [
            ...tableData,
            [
                {
                    content: "TOTAL",
                    colSpan: 3,
                    styles: { halign: "left", fontStyle: "bold" },
                },
                {
                    content: `${Number(total).toLocaleString("fr-FR").replace(/\u202F/g, " ")} F CFA`,
                    styles: { halign: "center", fontStyle: "bold" },
                },
            ],
        ],
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3,
            halign: "center",
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: 0,
            fontStyle: "bold",
        },
        columnStyles: {
            0: { halign: "left" },
        },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // =========================
    // 🔥 POINTILLÉS INTELLIGENTS
    // =========================

    const marginLeft = 14;
    const marginRight = 14;
    const maxWidth = pageWidth - marginLeft - marginRight;

    const texte = "Arrêtée la présente facture à la somme de : ";

    const generateDots = (baseText: string) => {
        let dots = "";
        const dotWidth = doc.getTextWidth(".");
        const baseWidth = doc.getTextWidth(baseText);

        const remainingWidth = maxWidth - baseWidth;

        const dotCount = Math.floor(remainingWidth / dotWidth);

        return ".".repeat(dotCount);
    };

    const lineText = texte + generateDots(texte);

    doc.text(lineText, marginLeft, finalY + 10);

    // =========================
    // SIGNATURES
    // =========================

    doc.text("Le Directeur Général", 14, finalY + 30);
    doc.text("Le client", pageWidth - 50, finalY + 30);

    doc.setFont("helvetica", "bold");
    doc.text("BAMOGO Mohamadi", 14, finalY + 36);

    // =========================
    // EXPORT
    // =========================

    const nom = `facture_${client.nom_prenom}_${Date.now()}.pdf`;
    const pdfBlob = doc.output("blob");



    const file = new File([pdfBlob], nom, { type: "application/pdf" });

    return file;
};
const XLSX = require("xlsx");
const fs = require("fs");
require('dotenv').config();
const path = require("path");
const { Media } = require('../models');

const produitImport = require("../batch/produit_import");

const strategies = {
    produits: produitImport,
};


async function lancerImport(imp) {
    const chemin = path.join(process.cwd(), imp.media.url);
    console.log("Path : ", chemin);
    const url1 = `http://${process.env.host}:${process.env.port}${imp.media.url}`;
    console.log("URL 1", url1);

    const workbook = XLSX.readFile(chemin);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Créer un fichier log
    const logFile = path.join(__dirname, `../uploads/fichier_journal_${imp.id}.txt`);
    console.log(logFile);

    const stream = fs.createWriteStream(logFile, { flags: "a" });

    // Récupérer la stratégie en fonction du type
    const handler = strategies[imp.type];
    if (!handler) throw new Error(`Type d'import inconnu : ${imp.type}`);

    for (const row of rows) {
        try {
            await handler(row,imp.id_etablissement);
            stream.write(`${JSON.stringify(row)} = OK\n`);
        } catch (err) {
            stream.write(`${JSON.stringify(row)} = ERREUR : ${err.message}\n`);
        }
    }

    stream.end();

    console.log("URL : ", logFile);
    const url = `/uploads/fichier_journal_${imp.id}.txt`;
    console.log("Url : ", url);

    // Sauvegarder le journal dans Media
    const media = await Media.create({
        url: url,
        type: "txt",
        nom: `fichier_journal_${imp.id}`
    });

    return media.id;
}

module.exports = { lancerImport };

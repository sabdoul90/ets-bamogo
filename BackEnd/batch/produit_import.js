const { Produit } = require('../models');

module.exports = async function (row, etablissement) {
    if (!row.nom) throw new Error("Nom manquant");

    const produit = await Produit.findOne({
        where: {
            nom: row.nom.toUpperCase(),
            id_etablissement: etablissement
        }
    });

    console.log("Existance  : ", produit);
    if (produit) {

        if (row.quantite && row.quantite > 0) {
            produit.quantite_stock += row.quantite;
        }


        if (row.prix_unitaire !== produit.prix_unitaire) {
            produit.prix_unitaire = row.prix_unitaire;
        }

        await produit.save();

        return "Produit mis à jour";
    } else {
        await Produit.create({
            nom: row.nom.toUpperCase(),
            quantite_stock: row.quantite || 0,
            prix_unitaire: row.prix_unitaire || 0,
            id_etablissement: etablissement
        });

        return "Produit créé";
    }


};
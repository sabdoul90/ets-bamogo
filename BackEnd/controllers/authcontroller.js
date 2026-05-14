const { Utilisateur} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');


module.exports = {

    async login(req, res) {
        try {



            const { telephone, mot_de_passe } = req.body;


            const include = "etablissement,role";

            const options = manajer(
                {},
                carte.utilisateur(db),
                include
            );

            console.log("Options pour la recherche de l'utilisateur : ", options);

            const user = await Utilisateur.findOne({
                where: { telephone },
                ...options
            });

            if (!user) {
                return res.status(404).json({ data: { message: "Utilisateur introuvable" } });
            }

            const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

            if (!valid) {
                return res.status(401).json({ data: { message: "Mot de passe incorrect" } });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.SECRET,
                { expiresIn: "24h" }
            );

            user.token = token;
            await user.save();
            user.token = undefined;
            user.mot_de_passe = undefined;

            return res.cookie("jwt", token, {
                httpOnly: false,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
            }).status(200).json(
                {
                    data: {
                        message: "La connexion a réussi !",
                        //  token,
                        utilisateur: user
                    }
                });

        } catch (error) {
            res.status(500).json({
                data: {
                    message: error.message,
                    erreur: error
                }
            });
        }
    },

    async me(req, res) {
        try {
            const include = 'role,etablissement';

            const options = manajer(
                {},
                carte.utilisateur(db),
                include
            );
            const user = await Utilisateur.findByPk(req.utilisateur.id,
                {
                    attributes: {
                        exclude: ['mot_de_passe', 'token']

                    },
                    ...options
                });
            res.json({ data: user });
        } catch (error) {
            res.status(500).json({
                data: {
                    message: error.message,
                    erreur: error
                }
            });
        }
    },

    async register(req, res) {
        try {
            const { nom, prenom, telephone, mot_de_passe, id_role, id_etablissement } = req.body;

            if (!mot_de_passe) {
                return res.status(400).json({ data: { message: 'Mot de passe requis' } });
            }

            if (!id_role) {
                return res.status(400).json({ data: { message: 'id_role requis pour associer un rôle' } });
            }


            const hash = await bcrypt.hash(mot_de_passe, 10);


            const utilisateur = await Utilisateur.create({
                nom,
                prenom,
                telephone,
                mot_de_passe: hash,
                id_role,
                id_etablissement
            });


            return res.status(201).json({ data: utilisateur });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
        }
    },

    async logout(req, res) {
        console.log("Utilisateur qui accede à la deconnexion : ", req.utilisateur);
        res.clearCookie("jwt");
        res.status(200).json({ data: { message: "Deconnexion effectuée avec succès" } });
    },
};
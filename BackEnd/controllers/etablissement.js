const { Etablissement } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getEtablissements(req, res) {
        try {

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.etablissement(db),
                include
            );

            const { rows, count } = await Etablissement.findAndCountAll(options);

            

            return res.status(200).json({
                data: rows,
                pagination: {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10,
                    total: count,
                    pages: Math.ceil(count / (limit || 10))
                }
            });

        } catch (error) {

            return res.status(500).json({
                data : {message: error.message},
                
            });

        }
    },

    async createEtablissement(req, res) {

        try {

            const etablissement = await Etablissement.create(req.body);

            return res.status(201).json({
                message: "Ajout effectué avec succès",
                data: {
                    etablissement
                }
            });

        } catch (error) {


            return res.status(500).json({
                data : {
                    message: error.message
                }
                
            });

        }

    },

    async updateEtablissement(req, res) {

        try {

            await Etablissement.update(
                req.body,
                { where: { id: req.params.id } }
            );

            return res.status(200).json({
                data: {message: "Etablissement modifié",}
            });

        } catch (error) {

            return res.status(500).json({
                data :{
                    message: error.message
                }
            });

        }

    },

    async getEtablissementById(req, res) {

        try {

            const { include } = req.query;

            const options = manajer(
                {},
                carte.etablissement(db),
                include
            );

            const etablissement = await Etablissement.findByPk(
                req.params.id,
                options
            );

            if (!etablissement) {


                return res.status(404).json({
                    
                    data : {
                        message: "Etablissement introuvable"
                    }
                });

            }

            return res.status(200).json({
                data: etablissement
            });

        } catch (error) {


            return res.status(500).json({
                data: {
                    message: error.message
                }

            });

        }

    },

    async deleteEtablissement(req, res) {

        try {

            await Etablissement.destroy({
                where: { id: req.params.id }
            });


            return res.status(200).json({

                data: { message: "Etablissement supprimé", }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }

    }

};
const { Media } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async mediaUploads(req, res) {

        try {
            if (!req.file) {
                return res.status(400).json({ data: { message: "Aucun fichier selectionné." } })
            }

            const url = `/uploads/${req.file.filename}`;
            const media = await Media.create({
                nom: req.file.originalname,
                type: req.file.mimetype,
                url: url
            });

            if (!media) {
                return res.status(404).json({ data: { message: "Echec de l'ajout du media" } });
            }

            res.status(201).json({ message: "Ajout effectué avec succès ! ", data: media});

        } catch (e) {
            res.status(500).json({ data: { message: "Echec de l'ajout du media", erreur: e.message } });
        }
    },

    async getMedias(req, res) {
        try {

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.media(db),
                include
            );

            const { rows, count } = await Media.findAndCountAll(options);

            return res.status(200).json({
                data: { medias: rows },
                pagination: {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10,
                    total: count,
                    pages: Math.ceil(count / (limit || 10))
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },
    async getMediaById(req, res) {

        try {

            const { include } = req.query;

            const options = manajer(
                {},
                carte.media(db),
                include
            );

            const media = await Media.findByPk(
                req.params.id,
                options
            );

            if (!media) {

                return res.status(404).json({
                    data: {
                        message: "Media introuvable"
                    }
                });

            }

            return res.status(200).json({
                data: media
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    },
    async deleteMedia(req, res) {

        try {

            await Media.destroy({
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: {
                    message: "Media supprimé"
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    }

};
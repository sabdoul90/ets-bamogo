const { Import } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getImports(req, res) {
        try {

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.import(db),
                include
            );

            const { rows, count } = await Import.findAndCountAll(options);

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
                data: {
                    message: error.message
                }
            });

        }
    },

    async createImport(req, res) {

        try {

            const importation = await Import.create(req.body);

            return res.status(201).json({
                message: "Import créé avec succès",
                data: {
                    import: importation
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    },

    async updateImport(req, res) {

        try {

            await Import.update(
                req.body,
                { where: { id: req.params.id } }
            );

            return res.status(200).json({
                data: {
                    message: "Import modifié"
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    },

    async getImportById(req, res) {

        try {

            const { include } = req.query;

            const options = manajer(
                {},
                carte.import(db),
                include
            );

            const importation = await Import.findByPk(
                req.params.id,
                options
            );

            if (!importation) {

                return res.status(404).json({
                    data: {
                        message: "Import introuvable"
                    }
                });

            }

            return res.status(200).json({
                data: importation
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    },

    async deleteImport(req, res) {

        try {

            await Import.destroy({
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: {
                    message: "Import supprimé"
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
const { Role } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getRoles(req, res) {
        const { page, limit, include } = req.query;

        const options = manajer(
            { page, limit },
            carte.role(db),
            include
        );

        const { rows, count } = await Role.findAndCountAll(options);

        return res.status(200).json({
            data: rows,
            pagination: {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                total: count,
                pages: Math.ceil(count / (limit || 10))
            }
        });
    },

    async createRole(req, res) {
        const role = await Role.create(req.body);
        return res.status(201).json({
            data: {
                messsage: "Ajout effectué avec succès",
                data: role
            }
        });
    },

    async updateRole(req, res) {
        await Role.update(req.body, { where: { id: req.params.id } });

        return res.json({
            
            data : {
                message: 'Role modifié',
            }
        });
    },

    async getRoleById(req, res) {
        const { include } = req.query;
        console.log("Ici");


        const options = manajer(
            {},
            carte.role(db),
            include
        );

        const role = await Role.findByPk(req.params.id, options);

        if (!role) {
            return res.status(404).json({ message: 'Rôle introuvable' });
        }

        return res.status(200).json(role);
    },

    async deleteRole(req, res) {
        await Role.destroy({ where: { id: req.params.id } });
        return res.json({ message: 'Role supprimé' });
    }

};

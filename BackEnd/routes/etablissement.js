const express = require('express');
const route = express.Router();
const controller = require('../controllers/etablissement');

route.post('/', controller.createEtablissement);
route.get('/:id', controller.getEtablissementById);
route.put('/:id', controller.updateEtablissement);
route.get('/', controller.getEtablissements);
route.delete('/:id', controller.deleteEtablissement);

module.exports = route;
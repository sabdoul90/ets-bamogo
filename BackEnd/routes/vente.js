const express = require('express');
const route = express.Router();
const controller = require('../controllers/vente');
const verifierToken  = require('../middleware/verifierToken');


route.post('/', controller.createVente);
route.get('/:id', controller.getVenteById);
route.put('/:id', controller.updateVente);
route.get('/', verifierToken, controller.getVentes);
route.delete('/:id', controller.deleteVente);

module.exports = route;
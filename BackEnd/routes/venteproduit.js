const express = require('express');
const route = express.Router();
const controller = require('../controllers/venteproduit');

route.post('/', controller.createVenteProduit);
route.get('/:id', controller.getVenteProduit);
route.put('/:id', controller.updateVenteProduit);
route.get('/', controller.getVenteProduits);
route.delete('/:id', controller.deleteVenteProduit);

module.exports = route;
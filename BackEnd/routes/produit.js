const express = require('express');
const route = express.Router();
const controller = require('../controllers/produit');

route.post('/', controller.createProduit);
route.get('/:id', controller.getProduitById);
route.put('/:id', controller.updateProduit);
route.get('/', controller.getProduits);
route.delete('/:id', controller.deleteProduit);

module.exports = route;
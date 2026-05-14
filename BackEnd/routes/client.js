const express = require('express');
const route = express.Router();
const controller = require('../controllers/client');
const verifierToken  = require('../middleware/verifierToken');



route.post('/',  controller.createClient)
route.get('/:id', controller.getClientById);
route.put('/:id', controller.updateClient);
route.get('/',verifierToken, controller.getClients);
route.delete('/:id', controller.deleteClient);

module.exports = route;
const express = require('express');
const route = express.Router();
const controller = require('../controllers/import');

route.post('/', controller.createImport);
route.get('/:id', controller.getImportById);
route.put('/:id', controller.updateImport);
route.get('/', controller.getImports);
route.delete('/:id', controller.deleteImport);

module.exports = route;
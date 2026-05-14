const express = require('express');
const route = express.Router();
const controller = require('../controllers/role');

route.post('/', controller.createRole);
route.get('/:id', controller.getRoleById);
route.put('/:id', controller.updateRole);
route.get('/', controller.getRoles);
route.delete('/:id', controller.deleteRole);

module.exports = route;
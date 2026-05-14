const express = require('express');
const route = express.Router();
const statsController = require('../controllers/stats');

route.get('/', statsController.getstat);

module.exports = route;
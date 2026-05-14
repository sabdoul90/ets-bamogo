const express = require('express');
const route = express.Router();
const controller = require('../controllers/authcontroller');
const verifierToken  = require('../middleware/verifierToken');

route.post('/login', controller.login);
route.post('/register', controller.register);
route.post('/logout', verifierToken, controller.logout);
route.get('/me', verifierToken, controller.me);
//route.post('/auth/forget-password', controller.motDePasseOublie);
//route.post('/auth/new-password', controller.changerMotDePasse);
//route.post('/auth/validate-token', controller.validatetoken);

module.exports = route;
const app = require('./app');
require('dotenv').config();

const { sequelize } = require('./models');

const PORT = process.env.PORT || 1984;

sequelize.authenticate().then(()=>{
    console.log('Connexion etablie avec la base de données');
    app.listen(PORT, ()=> console.log('Le serveur est lancé sur le port ',PORT));
}).catch((e)=>{
    console.error('erreur lors du lancement',e);
});


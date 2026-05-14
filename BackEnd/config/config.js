require('dotenv').config();

//console.log(`process nom de la base de données ${process.env.DB_NAME}`);
//console.log(`process nom de la base de root ${process.env.PROPRIO}`);
//console.log(`process password ${process.env.PASSWORD}`);
//console.log(`process HOST ${process.env.HOST}`);
//console.log(`process PORT ${process.env.PORT_DB}`);
//console.log(`process nom de la base de données ${process.env.DIALECT}`);

const database_config = {
  "development": {
    "username": process.env.PROPRIO,
    "password": process.env.PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.PROPRIO,
    "password": process.env.PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT
  }
}

module.exports = database_config;

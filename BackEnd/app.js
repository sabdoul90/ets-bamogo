const cors = require('cors');
const express = require('express');
const cookieparser = require('cookie-parser');
const app = express();


const { commencerImport } = require('./batch/tacheimport');

//const authRoute = require('./routes/authentification');



app.use(express.json());
app.use(cookieparser());
app.use("/uploads", express.static("uploads"));

app.use(cors({
    origin: [
        "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:3002",
        "http://204.168.204.192:3000",
        "http://204.168.204.192:3001",
        "http://204.168.204.192:3002",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
));

commencerImport();


app.use('/api', require('./routes'));


module.exports = app;





const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const userRoutes = require('./routes/userroutes');

const db = require('./utils/database');


const app = express();
app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);

db.sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })






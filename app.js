const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const userRoutes = require('./routes/userroutes');
const expenseRoute = require('./routes/expenseroutes');
const membershipRoute = require('./routes/purchase');
const premiumfeatureRoute = require('./routes/premiumFeature');
const forgotPasswordRoute = require('./routes/forgotPasswordroute');


const db = require('./utils/database');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    {flags : 'a'}
    );

app.use(bodyParser.json({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream : accessLogStream}))

app.use('/user', userRoutes);
app.use('/expense',expenseRoute);
app.use('/purchase',membershipRoute);
app.use('/premium',premiumfeatureRoute);
app.use('/password',forgotPasswordRoute);

app.use((req,res) => {
    console.log("url -> ",req.url);
    res.sendFile(path.join(__dirname,`views/${req.url}`));
})


mongoose
    .connect('mongodb+srv://shubhammaske099:Shubham099@expensedatabase.uds96i9.mongodb.net/expense?retryWrites=true&w=majority')
    .then(result => {
        console.log('Connected...');
        app.listen(3000)
    })
    .catch(err => {
        console.log(err);
    })

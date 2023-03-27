const path = require('path');
const fs = require('fs');
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

const User = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const DownloadFile = require('./models/downloadFiles');

const db = require('./utils/database');
require('dotenv').config();


const app = express();
app.use(cors());

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

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadFile);
DownloadFile.belongsTo(User);


db.sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })






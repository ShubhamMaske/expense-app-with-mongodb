const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const userRoutes = require('./routes/userroutes');
const expenseRoute = require('./routes/expenseroutes');
const membershipRoute = require('./routes/purchase');
const premiumfeatureRoute = require('./routes/premiumFeature');
const forgotPasswordRoute = require('./routes/forgotPasswordroute');

const User = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');

const db = require('./utils/database');
require('dotenv').config();


const app = express();
app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);
app.use('/expense',expenseRoute);
app.use('/purchase',membershipRoute);
app.use('/premium',premiumfeatureRoute);
app.use('/password',forgotPasswordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


db.sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })






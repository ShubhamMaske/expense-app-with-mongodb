const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const userRoutes = require('./routes/userroutes');
const expenseRoute = require('./routes/expenseroutes');
const membershipRoute = require('./routes/purchase');
const premiumfeatureRoute = require('./routes/premiumFeature');

const User = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');

const db = require('./utils/database');
require('dotenv').config();


const app = express();
app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);
app.use('/expense',expenseRoute);
app.use('/purchase',membershipRoute);
app.use('/premium',premiumfeatureRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

db.sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })






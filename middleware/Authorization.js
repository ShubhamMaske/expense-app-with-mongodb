const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');
        console.log('userID >>>> ', user.userId)
        User.findByPk(user.userId).then(user => {

            req.user = user;
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})

      }

}
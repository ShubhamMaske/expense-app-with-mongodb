
const User = require('../models/users');

exports.addUser = async (req, res, next)=> {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({
            name: name,
            email: email,
            password: password
        })

        console.log("after creating-->"+JSON.stringify(data));
        res.status(201).json({newUser: data});

    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
}
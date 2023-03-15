
const User = require('../models/users');

function isStringinValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

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

exports.checkUser = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(isStringinValid(email) || isStringinValid(password)){
            res.status(400).json({message: " Bad Parameters", success:false})
        }
        console.log(password);
        let result = await User.findAll({
            where: {
                email: `${email}`
            }})
        console.log(result);
        console.log(result[0]);
        //console.log(result[0].password);
        if(result.length > 0){
            if(result[0].password == password){
                res.status(201).json({success:true, message: "User login Sucessful"});
            }else{
                res.status(401).json({success:false, message: "User not authorized"}) 
            }    
        }
        else{
            res.status(404).json({success:false, message:"user Doesn't exit"});
        }

    }
    catch(err){
       res.status(500).json({message:err, success:false})
    }
    
}
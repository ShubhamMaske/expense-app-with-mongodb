
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringinValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

// ----------------- For SignUp -------------------
exports.addUser = async (req, res, next)=> {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.hash(password,10,async(err,hash) => {
            const data = await User.create({name,email,password:hash})
            console.log("after creating-->"+JSON.stringify(data));
            res.status(201).json({newUser: data});
        })
        
    }
    catch(err){
        res.status(500).json({error: err})
    }
}

function generateAccessToken(id){
    return jwt.sign({userId : id},'8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');
}

//----------------  for Sign In    -----------------
exports.checkUser = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(isStringinValid(email) || isStringinValid(password)){
            res.status(400).json({message: " Bad Parameters", success:false})
        }
        console.log(password);
        let user = await User.findAll({where: {email}})
        //console.log(result);
        console.log(user[0]);
        console.log(user[0].password);
        if(user.length > 0){
            bcrypt.compare(password,user[0].password, (err, result)=>{
                if(err){
                    throw new Error("Something went wrong");
                }
                if(result === true){
                    res.status(201).json({success:true, message: "User login Sucessful",token: generateAccessToken(user[0].id)});  
                }
                else{
                    return res.status(401).json({success:false, message: "User not authorized"}) 
                }
            })   
        }
        else{
            return res.status(404).json({success:false, message:"user Doesn't exit"});
        }

    }
    catch(err){
       res.status(500).json({message:err, success:false})
    }
    
}
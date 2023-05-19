
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
        console.log(name);
        
        bcrypt.hash(password,10,async(err,hash) => {
            const user = new User({
                name: name,
                email: email,
                password: hash,
                ispremiumuser: false,
                totalExpense: 0
            })

            const data = await user.save();
            console.log(data);
            res.status(201).json({newUser: data});
        })
        
    }
    catch(err){
        res.status(500).json({error: err})
    }
}

function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId : id, name:name,ispremiumuser},process.env.TOKEN_PRIVATE_KEY);
}

//----------------  for Sign In    -----------------
exports.checkUser = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(isStringinValid(email) || isStringinValid(password)){
            res.status(400).json({message: " Bad Parameters", success:false})
        }
        let user = await User.findOne({email: email})
        console.log("=>",user);
        if(user){
            bcrypt.compare(password,user.password, (err, result)=>{
                if(err){
                    throw new Error("Something went wrong");
                }
                if(result === true){
                    res.status(201).json({success:true, message: "User login Sucessful",token: generateAccessToken(user._id,user.name,user.ispremiumuser)});  
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




exports.forgotPassword = async(req, res, next)=>{
    try{
        const email = req.body.email;
        console.log("Your email is >>>> ",email);
    }
    catch(err){
        console.log(err)
    }
}
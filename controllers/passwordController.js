
const Sib = require('sib-api-v3-sdk');
require('dotenv').config()

exports.forgotPassword = async(req, res, next)=>{
    try{
        const Email = req.body.email;
        console.log("Your email is >>>> ",Email);
        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.API_KEY

        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
        email: 'maske3317@gmail.com',
        }
        const receiver = [
        {
            email: Email,
        },
        ]

        tranEmailApi
    .sendTransacEmail({
        sender,
        to: receiver,
        subject: 'Password Reset mail',
        textContent: `
        Click the link to reset password.
        `,
    })
    .then((result)=>{
        console.log(result)
        return res.status(200).json({message: 'Link to reset password sent to your mail ', sucess: true})
    })
    }
    catch(err){
        res.status(500).json({error:err});
        console.log("Error---<>---",err)
    }
}
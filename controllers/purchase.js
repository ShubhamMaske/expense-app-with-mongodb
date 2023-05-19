const Razorpay = require('razorpay');

const Order = require('../models/order');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

exports.purchasepremium = async (req, res) => {
    try{
        let rzp = new Razorpay({
            key_id :process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"},(err, order) => {
            if(err){
                console.log("--> error ",err);
                throw new Error(JSON.stringify(err));
            }
            const orderCreated = new Order({
                orderid:order.id,
                status: 'PENDING',
                userId: req.user._id
            })
//req.user.createOrder({orderid:order.id, status:'PENDING',userId:req.user._id}).
            orderCreated.save()
            .then(() => {
                return res.status(201).json({order,key_id:rzp.key_id});
            }).catch(err => {
                throw new Error(err);
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'something went wrong',error: err});
    }
    
}

function updateToken(id,name,ispremiumuser){
    return jwt.sign({userId : id, name:name,ispremiumuser},process.env.TOKEN_PRIVATE_KEY);
}

exports.updateTransactionStatus = async (req, res) => {
    try{
        const {payment_id, order_id} = req.body;
        const order = await Order.findOne({orderid : order_id})
        const promise1 = Order.updateOne({orderid: order_id},{paymentid:payment_id, status:'SUCCESSFUL'})
        const promise2 = User.updateOne({_id:order.userId},{ispremiumuser: true})

        let user = await User.findOne({_id:order.userId})

        Promise.all([promise1,promise2]).then(() => {
            return res.status(202).json({success: true,message:"Transaction Successful",token: updateToken(user._id,user.name,user.ispremiumuser)});
        }).catch((err)=>{
                throw new Error(err);
            })
    }
    catch(err){
        console.log(err);  
    }
}
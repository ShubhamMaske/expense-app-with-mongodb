const Download = require('../models/downloadFiles');

exports.saveIndatabase = (req, url)=>{
    return Download.create({url:url,userId:req.user.id});
}

exports.getUrlFromDatabase = (req) => {
    return Download.findAll({where : {userId: req.user.id}});
}
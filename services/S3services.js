const AWS = require('aws-sdk');

exports.uploadToS3 = (data,filename) => {
    const BUCKET_NAME = 'expensetrackerwebapp'
    const IAM_USER_KEY = 'AKIAXAPFHS6ETKPPQ3XF'
    const IAM_SECRET_KEY = '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'

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY ,
        secretAccessKey: IAM_SECRET_KEY,
        //bucket: BUCKET_NAME
    })

    
        var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err){
                    console.log("err ==",err);
                    reject(err);
                }else{
                    // console.log("Success ==", s3response);
                    console.log("resss -",s3response.Location);
                    resolve(s3response.Location);
                }
            })
        })   
}
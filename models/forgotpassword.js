const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotpasswordSchema = new Schema({
    _id:{
        type: Schema.Types.UUID
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: String
    }
},{_id: false})

module.exports = mongoose.model('Forgotpassword',forgotpasswordSchema)




const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ispremiumuser:{
    type: Boolean
  },
  totalExpense: {
    type:Number
  },
  Expenses: [
    {type:Schema.Types.ObjectId, ref: 'Expense'}
  ]
  
})




module.exports = mongoose.model('User',userSchema);


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name:{
       type:String
   },
   email:{
       type:String
   },
   password:{
       type:String
   },
   crops:{
       type:Array
   },
   created:{
       type:Date,
       default: Date.now()
   },
   image:{
     type: String
   }
})
const User = mongoose.model('User', UserSchema);
module.exports = User;

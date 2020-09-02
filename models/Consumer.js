const mongoose = require('mongoose');

const ConsumerSchema = new mongoose.Schema({
   firstname:{
       type:String
   },
   lastname:{
       type:String
   },
   email:{
       type:String
   },
   username:{
       type:String
   },
   password:{
       type:String
   },
   created:{
       type:Date,
       default: Date.now()
   },
   image:{
     type: String
   },
   type:{
     type: String
   }
})
const Consumer = mongoose.model('Consumer', ConsumerSchema);
module.exports = Consumer;

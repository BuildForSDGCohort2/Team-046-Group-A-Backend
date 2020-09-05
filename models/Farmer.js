const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
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
   crops:{
       type:Array
   },
   created:{
       type:Date,
       default: Date.now()
   },
   image:{
     type: String
   },
   animals:{
     type: Array
   },
   type:{
     type: String
   }
})
const Farmer = mongoose.model('Farmer', FarmerSchema);
module.exports = Farmer;

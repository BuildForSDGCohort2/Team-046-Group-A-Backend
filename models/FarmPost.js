const mongoose = require('mongoose');

const FarmPostSchema = new mongoose.Schema({

farmersId:{

  type: String,
  required: true,
  required: true
},

categoryId: {
  type: String,
  required: true
},

image:{
  type: String,
  required: true
},

description :{
  type: String,
  required: true
},

price:{
  type: Number,
  required: true
},

createdAt:{
  type: Date,
  default: Date.now()
},

updatedAt:{
  type: Date,
  default: Date.now()
}
});

const FarmPost  = mongoose.model('FarmPost',FarmPostSchema);
module.exports = FarmPost;

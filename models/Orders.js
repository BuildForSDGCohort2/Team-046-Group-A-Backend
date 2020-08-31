const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({

farmersId:{

  type: String,
  required: true
},

categoryId: {
  type: String,
  required: true
},

consumersId:{

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

const Orders = mongoose.model('Orders', OrdersSchema);
module.exports = Orders;

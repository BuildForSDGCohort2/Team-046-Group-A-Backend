const mongoose = require('mongoose');

const ChatsSchema = new mongoose.Schema({

sendersId:{

  type: String,
  required: true
},

receversId: {
  type: String,
  required: true
},

message:{

  type: String,
  required: true
},

date:{

  type: Date,
  default: Date.now()
}

});

const Chats = mongoose.model("Chats",ChatsSchema);
module.exports = Chats;

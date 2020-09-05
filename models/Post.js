const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  fullname:{
      type:String
  },
  post_id:{
      type:String
  },
  category:{
      type:String
  },
  image:{
      type:String
  },
  description:{
      type:String
  },
   price:{
       type:Number
   },
   date:{
       type:Date,
       default: Date.now()
   },
   day:{
     type: String
   },
   month:{
     type: String
   },
   year:{
     type: String
   }
})
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

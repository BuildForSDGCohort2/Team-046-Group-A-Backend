const User = require("../models/User.js");
const Chats = require("../models/Chats.js");

const mongoose = require("mongoose");

const DB_URI = "mongodb://localhost/farmConnect"||process.env.ATLAS_URI;
mongoose.connect(DB_URI,{useNewUrlParser:true,
                        useCreateIndex:true,
                        useUnifiedTopology:true,
                        useFindAndModify: false})
        .then((r) => console.log("Succesffully Connected to DB"))
        .catch((err) => {
          console.log("Failed to connect to DB. Detail:"+err )
        });


exports. createAUser = (userInfo, res) => {
  User.findOne({email: userInfo.email}, function (err, data) {
      if(err) {
            res.json({error: "Error Occured. Contact Developer"});
          }
      else if(data!==null && userInfo.email == data.email) {
        res.json({error: "This UserName '"+data.email+"' already exists"});
      }
      else {
          let user = new User(userInfo);
          user.save().then(() => res.json(user));
      }
  });
}

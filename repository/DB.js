const User = require("../models/User.js");
const Chats = require("../models/Chats.js");

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

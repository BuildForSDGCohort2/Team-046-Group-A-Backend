var express = require("express");
var router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dbApp = require("../repository/DB.js");
const key = process.env.SECRET_KEY || "secret";
const User = require("../models/User");
router.use(cors())
const errorMsg={};
const status ={};

router.post("/signup", async(req,res)=>{
  const body = req.body;
  if(body === null){
    errorMsg.error="Empty Request Body!"
    res.json(errorMsg);
    }
  else if (!body.hasOwnProperty("email")|| !body.hasOwnProperty("password")) {
    errorMsg.error="Missing emails/password fields";
    res.json(errorMsg);
  }
    else{
      bcrypt.hash(body.password, parseInt(process.env.SALT_ROUNDS||12, 10), function(err, hash){
        if(err) {
          errorMsg.error="Internal Error. Contact Developer";
           res.json(errorMsg);
        }
       else {
           body.password = hash;
           dbApp.createAUser(body, res);
         }
      });
    }
})

router.post("/login",(req,res)=>{

})
router.get("/users",(req,res) => {

})

router.get("/user/:id",(req,res) => {
  User.findOne({_id: req.params.id})
    .then(post=>res.json(post))
})
router.delete("/user/:id",(req,res) => {
  User.findOneAndDelete({_id: req.params.id})
    .then(() => {
      res.json({msg:"User Deleted"})
    })
})
router.post("/updateuser/:id",async(req,res)=>{

 })

module.exports = router;

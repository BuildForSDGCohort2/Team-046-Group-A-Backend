var express = require('express');
var router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const key = process.env.SECRET_KEY || 'secret';
router.use(cors());
const User = require('../models/User');
const errorMsg={};
const status ={};

router.get("/api/server/status", async(req, res) => {
  const query = req.query;
  status.msg ="Server is Up and Ready";
  res.json(status);

});
router.post('/signup', async(req,res)=>{
  const today = new Date()

  const userData ={
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      crops:[...req.body.crops],
      created:today,
      image:req.body.image
  }
  User.findOne({
      email:req.body.email
  })
      .then(user=>{
          if(!user){
              bcrypt.hash(req.body.password,10,(err,hash)=>{
                  userData.password=hash
                  User.create(userData)
                      .then(user=>{
                          res.json({msg:'Sign Up Successful'})
                      })
                      .catch(err=>{
                          res.send('error' + err)
                      })
              })
          }else{
              res.json({error:'User Already exist'})
          }
      })
      .catch(err=>{
          res.send('error' + err)
      })
});

router.post('/login',(req,res)=>{
  User.findOne({email:req.body.email})
      .then(user=>{
          if(user){
              if(bcrypt.compareSync(req.body.password, user.password)){
                  const payload = {
                      _id : user._id,
                      name: user.name,
                      email: user.email,
                      crops:[...user.crops],
                      image: user.image
                  }
                  let token = jwt.sign(payload, key)
                  res.send(token)
              }else{
                  res.json({error: 'Passwords do not match'})
              }
          }else{
              res.json({error: 'User does not exist'})
          }
      })
      .catch(err=>{
          res.send('error' + err)
      })
});

module.exports = router;

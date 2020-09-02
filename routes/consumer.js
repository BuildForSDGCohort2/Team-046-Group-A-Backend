var express = require('express');
var router = express.Router();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const key = process.env.SECRET_KEY || 'secret'
router.use(cors())
const Consumer = require('../models/Consumer')
router.post('/signup', async(req,res)=>{
  const today = new Date()

  const consumerData ={
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
      created:today,
      image:req.body.image,
      type:'consumer'
  }
  Consumer.findOne({
      email:req.body.email
  })
      .then(consumer=>{
          if(!consumer){
              bcrypt.hash(req.body.password,10,(err,hash)=>{
                  consumerData.password=hash
                  Consumer.create(consumerData)
                      .then(consumer=>{
                          res.json({msg:'Sign Up Successful'})
                      })
                      .catch(err=>{
                          res.send('error' + err)
                      })
              })
          }else{
              res.json({error:'Consumer Already exist'})
          }
      })
      .catch(err=>{
          res.send('error' + err)
      })
})

router.post('/login',(req,res)=>{
  Consumer.findOne({email:req.body.email})
      .then(consumer=>{
          if(consumer){
              if(bcrypt.compareSync(req.body.password, consumer.password)){
                  const payload = {
                      _id : consumer._id,
                      firstname: consumer.firstname,
                      email: consumer.email,
                      image: consumer.image,
                      lastname: consumer.lastname,
                      username: consumer.username,
                      type: consumer.type
                  }
                  let token = jwt.sign(payload, key)
                  res.send(token)
              }else{
                  res.json({error: 'Passwords do not match'})
              }
          }else{
              res.json({error: 'Consumer does not exist'})
          }
      })
      .catch(err=>{
          res.send('error' + err)
      })
})

module.exports = router;

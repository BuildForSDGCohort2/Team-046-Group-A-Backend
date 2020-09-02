var express = require('express');
var router = express.Router();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const key = process.env.SECRET_KEY || 'secret'
router.use(cors())
const Farmer = require('../models/Farmer')
const Post = require('../models/Post')
router.post('/signup', async(req,res)=>{
  const today = new Date()

  const farmerData ={
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
      crops:[...req.body.crops],
      animals:[...req.body.animals],
      created:today,
      image:req.body.image,
      type:'farmer'
  }
  Farmer.findOne({
      email:req.body.email
  })
      .then(farmer=>{
          if(!farmer){
              bcrypt.hash(req.body.password,10,(err,hash)=>{
                  farmerData.password=hash
                  Farmer.create(farmerData)
                      .then(farmer=>{
                          res.json({msg:'Sign Up Successful'})
                      })
                      .catch(err=>{
                          res.send('error' + err)
                      })
              })
          }else{
              res.json({error:'Farmer Already exist'})
          }
      })
      .catch(err=>{
          res.send('error' + err)
      })
})

router.post('/login',(req,res)=>{
  Farmer.findOne({email:req.body.email})
      .then(farmer=>{
          if(farmer){
              if(bcrypt.compareSync(req.body.password, farmer.password)){
                  const payload = {
                      _id : farmer._id,
                      lastname: farmer.lastname,
                      email: farmer.email,
                      crops:[...farmer.crops],
                      image: farmer.image,
                      animals:[...farmer.animals],
                      firstname:farmer.firstname,
                      username:farmer.username,
                      type: farmer.type
                  }
                  let token = jwt.sign(payload, key)
                  res.send(token)
              }else{
                  res.json({error: 'Passwords do not match'})
              }
          }else{
              res.json({error: 'Farmer does not exist'})
          }
      })
      .catch(err=>{
          res.send('error' + err)
      })
})
router.get('/posts',(req,res) => {
  jwt.verify(req.headers['authorization'],key)
  Post.find()
    .sort({date:-1})
    .then(posts=>res.json(posts))
})
router.get('/uploads',(req,res) => {
  const decode = jwt.verify(req.headers['authorization'],key)
  Post.find({post_id:decode._id})
    .sort({date:-1})
    .then(posts=>res.json(posts))
})
router.get('/post/:id',(req,res) => {
  Post.findOne({_id: req.params.id})
    .then(post=>res.json(post))
})
router.delete('/post/:id',(req,res) => {
  Post.findOneAndDelete({_id: req.params.id})
    .then(() => {
      res.json({msg:'Post Deleted'})
    })
})
router.post('/updatepost/:id',async(req,res)=>{
  var {category,
  image,
  description,
  price} = req.body
   var update = {
     category,
     image,
     description,
     price
   }

   try {
       const post = Post.findByIdAndUpdate({_id:req.params.id }, {
           $set: update
       }, {
           new: true,
           runValidators: true,
           upsert: true,
           returnOriginal: false,
           returnNewDocument: true
       }).exec()
       if (!post) throw Error('Something went wrong when updating the post');

       res.status(200).json(post);
     } catch (e) {
       res.status(400).json({ msg: e.message });
     }
 })
router.post('/upload',async(req,res) => {
  const decode = jwt.verify(req.headers['authorization'],key)
  var {fullname,post_id,category,image,description,price} = req.body
  var d = new Date();
    var day = d.getDate()
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var month = months[d.getMonth()]
  var year = d.getFullYear
  const newPost = new Post({
    fullname,
    post_id,
    category,
    image,
    description,
    price,
    date:d,
    day,
    month,
    year
  })
  try {
      const post = await newPost.save();
      if (!post) throw Error('Something went wrong when uploading the post');

      res.status(200).json(post);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
})
module.exports = router;

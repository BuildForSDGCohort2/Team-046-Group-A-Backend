const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
var farmerRouter = require('./routes/farmer');
const consumerRouter = require('./routes/consumer');
const mongoose = require("mongoose");
mongoURI =process.env.ATLAS_URI
 mongoose.connect(mongoURI,
  {
    useNewUrlParser: true,
  useCreateIndex:true,
   useUnifiedTopology:true,
   useFindAndModify: false
 })
const connection = mongoose.connection
connection.once('open', ()=>{
 console.log('MongoDB database connected succesfully')
})

app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://farmconnect-frontend.herokuapp.com/"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/farmer', farmerRouter);
app.use('/consumer', consumerRouter)
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});

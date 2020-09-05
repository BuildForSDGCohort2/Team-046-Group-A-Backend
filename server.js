const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors")
const nocache = require("nocache");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const dotenv = require("dotenv");
var indexRouter = require("./routes/index");
var farmerRouter = require("./routes/farmer");
var userRouter = require("./routes/user");
const consumerRouter = require("./routes/consumer");
const mongoose = require("mongoose");
dotenv.config();
mongoURI = process.env.DB_LOCAL||process.env.ATLAS_URI;
mongoose.connect(mongoURI,{useNewUrlParser:true,
                          useCreateIndex:true,
                          useUnifiedTopology:true,
                          useFindAndModify: false})
        .then((r) => console.log("Succesffully Connected to DB"))
        .catch((err) => {
          console.log("Failed to connect to DB. Detail:"+err )
        });

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet.hidePoweredBy({setTo:"Pascal 419"}));
app.use(helmet.frameguard({action:"deny"}));
app.use(helmet.xssFilter());
app.use(nocache());
app.use("/", indexRouter);
app.use("/farmer", farmerRouter);
app.use("/consumer", consumerRouter);
app.use("/api/user/", userRouter);

if(process.env.NODE_ENV==="production"){
  app.use(express.static("client/build"))
  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
  })
}

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});
if(process.env.NODE_ENV === "test") {
  console.log("Running Tests...");
}
module.exports = app; // for testing

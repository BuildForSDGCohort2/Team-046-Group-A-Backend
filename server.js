const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const cors = require("cors")
const nocache = require("nocache");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const dotenv = require("dotenv");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const indexRouter = require("./routes/index");
const farmerRouter = require("./routes/farmer");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chats.js");
const chatAuth = require("./services/auth.js");
const consumerRouter = require("./routes/consumer");
const mongoose = require("mongoose");
const passportSocketIo=require('passport.socketio');
const cookieParser= require("cookie-parser");
const sessionStore= new session.MemoryStore();
dotenv.config();

app.use(cors())
app.set("view engine","pug");
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
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
    res.sendFile(path.join(__dirname, "client", "build"))
  })
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key:          'express.sid',
  secret:       process.env.SESSION_SECRET,
  store:        sessionStore
}));
mongoURI = process.env.DB_LOCAL||process.env.ATLAS_URI;
mongoose.connect(mongoURI,{useNewUrlParser:true,
                          useCreateIndex:true,
                          useUnifiedTopology:true,
                          useFindAndModify: true})
        .then((r) => {
          console.log("Succesffully Connected to DB");
          const db = mongoose.connection;
          chatAuth(app,db);
          chatRouter(app);

          const port = process.env.PORT || 5000

          http.listen(port, () => {
            console.log(`Server Running at ${port}`)
          });
          //for chatting
          let currentUsers= 0;
          io.on("connection", (socket) =>{
            ++currentUsers;
            console.log("A new user named "+socket.request.user.name+" is connected for chatting");
            io.emit("user", {name:socket.request.user.name,"currentUsers":currentUsers, connected:true});
            socket.on("chat message",(msg) =>{
              console.log("Received chat message: "+msg)
              io.emit("chat message",{"name": socket.request.user.name,"message":msg});
            });

            socket.on("disconnect",() =>{
              --currentUsers;
              console.log("A new user named "+socket.request.user.name+" is disconnected from chatting");
              io.emit("user",{name:socket.request.user.name,"currentUsers":currentUsers,connected:false});

            });
          });
          if(process.env.NODE_ENV === "test") {
            console.log("Running Tests...");
          }
        })
        .catch((err) => {
          console.log("Failed to connect to DB. Detail:"+err )
        });

module.exports = app; // for testing

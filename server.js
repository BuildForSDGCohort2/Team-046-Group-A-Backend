const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors")({origin:"*"});
const nocache = require("nocache");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const dotenv = require("dotenv");
var indexRouter = require("./routes/index");
var dbApp = require("./repository/DB.js");
var runner = require("./test-runner");

app.use(bodyParser.json());
app.use(cors);
app.use(helmet.hidePoweredBy({setTo:"Pascal 419"}));
app.use(helmet.frameguard({action:"deny"}));
app.use(helmet.xssFilter());
app.use(nocache());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', indexRouter);
const errorMsg={};
const status ={};

dotenv.config();

app.route("/api/server/status")
   .get((req, res) => {
     const query = req.query;
     status.msg ="Server is Up and Ready";
     res.json(status);

   });
app.route("/api/user/register")
   .post((req, res) => {
     const body = req.body;
     if(body === null){
       errorMsg.error="Empty Request Body!"
       res.json(errorMsg);
       }
     else if (body.email==null || body.password == null) {
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

   });

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server Running at ${port}`));

console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log("Tests are not valid:");
          console.log(error);
      }
    }, 1500);

module.exports = app;

const session     = require("express-session");
const mongo       = require("mongodb").MongoClient;
const passport    = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

module.exports = function (app, db) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((myId, done) => {
        db.collection("user").findOne(
            {id: myId},
            (err, doc) => {
                done(null, doc);
            }
        );
    });

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/github/callback"

      },
      function(accessToken, refreshToken, profile, cb) {
          db.collection("user").findAndModify(
              {id: profile.id},
              {},
              {$setOnInsert:{
                  id: profile.id,
                  name: profile.displayName || "Anonymous",
                  photo: profile.photos[0].value || "",
                  email: profile.emails[0].value || "No public email",
                  createdAt: new Date(),
                  provider: profile.provider || "",
                  chatMessages: 0
              },$set:{
                  lastLogin: new Date()
              },$inc:{
                  loginCount: 1
              }},
              {upsert:true, new: true}, //Insert object if not found, Return new object after modify
              (err, doc) => {
                  return cb(null, doc.value);
              }
          );
        }
    ));

};

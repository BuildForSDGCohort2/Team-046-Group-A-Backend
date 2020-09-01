var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
let newestThreadId = 0;
suite('Functional Tests', function() {
  let newestThreadId=null; // To be used to tst delete
  suite('API ROUTING FOR /api/....', function() {

    suite('GET', function() {
      test('Test Application Context', function (done) {
        chai.request(server)
            .get('/api/server/status')
            .query({})
            .end(function (err,res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.msg,'Server is Up and Ready');
              done();
            });
      });
    });

    suite('POST', function() {
      test('Create A New User',function (done) {
        chai.request(server)
            .post('/api/user/register')
            .send({
              "name":"Ciga Igbo",
              "password":"ciga",
              "email":"ciga@gmail.com",
              "crops":["Maize","Yam"],
              "animal":[]
            })
            .end(function (err,res) {
              //console.log("Results of Create General Message Thread=="+JSON.stringify(res.body));
              assert.equal(res.status, 200);
              assert.equal(res.body.name, 'Ciga Igbo');
              assert.equal(res.body.email, 'ciga@gmail.com');
              assert.property(res.body,'createdAt',' createdAt must be found in the array');
              newestThreadId=res.body._id;// To be used to tst delete
              done();
            });
      });
    });

    suite('POST', function() {
      test('Create An Already Existing User',function (done) {
        chai.request(server)
            .post('/api/user/register')
            .send({
              "name":"Ciga Igbo",
              "password":"ciga",
              "email":"ciga@gmail.com",
              "crops":["Maize","Yam"],
              "animal":[]
            })
            .end(function (err,res) {
              //console.log("Results of Create General Message Thread=="+JSON.stringify(res.body));
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "This UserName 'ciga@gmail.com' already exists");
              done();
            });
      });
    });

    suite('POST', function() {
      test('Missing Emails and Password fields',function (done) {
        chai.request(server)
            .post('/api/user/register')
            .send({
              "name":"Ciga Igbo",
              "crops":["Maize","Yam"],
              "animal":[]
            })
            .end(function (err,res) {
              //console.log("Results of Create General Message Thread=="+JSON.stringify(res.body));
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Missing emails/password fields");
              done();
            });
      });
    });
  });
});

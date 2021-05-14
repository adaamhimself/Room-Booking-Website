/*const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require("fs");
const mongoose = require('./connection');
const User = require('./models/user');
const Listing = require('./models/listing');

// multer
const storage = multer.diskStorage({
    destination: "./public/photos/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });


// Body parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));

//sign in post route
app.post('/signIn', (req, res) => { 
    var email = req.body.email;
    var password = req.body.signInPassword;
    var userlogin = User.findOne({ email: email})
    .exec((err, login) => {
        if (err) {
            console.log(err);
        }
        else if (!User) { console.log("Email"); }
        else {
            console.log(login);
        }
    
    });
    bcrypt.compare(password, userlogin, function(err, result) {
        if (err) { console.log(err); }
        if (result) {
            console.log("match");
            req.session.User = {
                fullname: User.signInUsername,
                password: User.password,
                email: User.email,
                birthdate: User.birthdate,
                admin: User.admin
            };
            res.render('/dashboard'); 
        }
        else { 
            console.log("no match"); 
            console.log(password);
            console.log(this.password);
        }
    });
});

// add user route
app.post('/addUser',  (req, res) => {
    var newU = new User({
        fullname: req.body.signInUsername,
        password: req.body.signInPassword,
        email: req.body.email,
        birthdate: req.body.birthdate,
    });
    newU.save((err) => {
        if (err) {
            console.log("error saving: " + err);
        } else {
            console.log("Saved");
            res.redirect('/dashboard');
        }
    });
});

// add listing route
app.post('/addListing', upload.single("photo"), (req, res) => {
    var newListing = new Listing({
        title: req.body.roomTitle,
        description: req.body.roomDescription,
        pricepernight: req.body.roomPPN,
        location: req.body.roomLocation,
        photoloc: req.body.photo
    });
    newListing.save((err) => {
        if (err) {
            console.log("error saving: " + err);
        } else {
            console.log("Saved");
            res.redirect('/dashboard');
        }
    });
});*/

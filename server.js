const path = require("path");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const clientSessions = require("client-sessions");
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require("fs");
const http = require("http");
const https = require("https");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const User = require('./models/user');
const Listing = require('./models/listing');
const Booking = require('./models/booking');
const e = require("express");


const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;
const KEYDIR = "./key/";
const SSL_KEY_FILE = KEYDIR + "server.key";
const SSL_CRT_FILE = KEYDIR + "server.crt";

const https_options = {
    key: fs.readFileSync(__dirname + "/" + SSL_KEY_FILE),
    cert: fs.readFileSync(__dirname + "/" + SSL_CRT_FILE)
};

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mongo connect
mongoose.connect(mongoString, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("open", () => {
    console.log("Database connection open.");
});


// multer
const storage = multer.diskStorage({
    destination: "./views/photos/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

// Body parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));

// Handlebars
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}));

// Sessions
app.use(clientSessions({
    cookieName: "session",
    secret: "web322-assignment345",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/signIn");
    } else {
      next();
    }
  }

// routes
app.get('/', (req, res) => {
    Listing.find({ location: "Toronto"}).lean()
    .exec()
    .then((listings) => {
        res.render('main', {
            layout : 'index',
            user: req.session.user,
            listings: listings,
        });
    });
   
});

app.get('/signIn', (req, res) => {
    res.render('signIn', {layout: false});
});

app.get('/register', (req, res) => {
    res.render('register', {layout: false});
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect("/signIn");
});

app.get("/viewListing", ensureLogin, (req, res) => {
    res.redirect("signIn");
});

app.get('/dashboard', ensureLogin, (req, res) => {
    Listing.find({ location: "Toronto"}).lean()
    .exec()
    .then((listings) => {
        res.render('dashboard', {
            layout : false,
            user: req.session.user,
            listings: listings,
        });
    });
});

app.get('/displayAllRooms', ensureLogin, (req, res) => {
    Listing.find({}).lean()
    .exec()
    .then((listAll) => {
        res.render('displayAllRooms', {
            layout: false,
            user: req.session.user,
            listAll: listAll,
        });
    });
});

// ***** POST routes *****

//login post route
app.post('/login', (req, res) => { 
    var password = req.body.signInPassword;
    var email = req.body.signInEmail;
    User.find({ email: email})
    .exec()
    .then((user) => {      
      user = user.map(value => value.toObject());
      console.log(user);
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) { console.log(err); }
        else { 
                req.session.user = {
                    password: user[0].password,
                    email: user[0].email,
                    admin: user[0].admin,
                    fullname: user[0].fullname,
                };
                res.redirect('/dashboard'); 
            }
      });
    })
    .catch((error) => {
        res.render('signIn', {layout: false, error: true});
    });
});

// add user route
app.post('/addUser',  (req, res) => {   
    var newU = new User({
        fullname: req.body.fullname,
        password: req.body.password,
        email: req.body.email,
        birthdate: req.body.birthdate,
        admin: req.body.admin,
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newU.password, salt, (err, hash) => {
            newU.password = hash;
            newU.save((err) => {
                if (err) {
                    console.log("error saving: " + err);
                } else {
                console.log("Saved");
                res.redirect('/dashboard');
                }
            });
        });
    });
});

// add listing route
app.post('/addListing', upload.single("photo"), (req, res) => {
    var filepath = "./photos/" + req.file.filename;
    var newListing = new Listing({
        title: req.body.roomTitle,
        description: req.body.roomDescription,
        pricepernight: req.body.roomPPN,
        location: req.body.roomLocation,
        photoloc: filepath,
        featured: req.body.featured,
    });
    newListing.save((err) => {
        if (err) {
            console.log("error saving: " + err);
        } else {
            console.log("Saved");
            res.redirect('/dashboard');
        }
    });
});

// query user route
app.post('/findUser', (req,res) => {
    var queryEmail = req.body.queryEmail;
    User.find({ email: queryEmail })
    .exec()
    .then((users) => {
    users = users.map(value => value.toObject());
    })
    .catch((err) => {
        console.log(err);        
    });
    res.redirect("/dashboard");
});

// delete user route
app.post('/deleteUser', (req,res) => {
    var deleteEmail = req.body.deleteEmail;
    User.deleteOne({ email: deleteEmail })
    .exec()
    .then(() => {
        console.log("removed user");
    })
    .catch((err) => {
        console.log(err);
    });
    res.redirect("/dashboard");
});

// delete listing route
app.post('/deleteListing', (req, res) => {
    var listingID = req.body.id;
    Listing.deleteOne({ _id: listingID })
    .exec()
    .then(() => {
        console.log("removed listing");
    });
    res.redirect("/displayAllRooms");
});

// display search results route
app.post('/searchResults', (req,res) => {
    var searchLoc = req.body.searchWhere;
    Listing.find({ location: searchLoc}).lean()
    .exec()
    .then((listings) => {
        res.render('searchResults', {
            layout : false,
            user: req.session.user,
            listings: listings,
        });
    });
});

// edit listing details route
app.post('/viewListing', (req,res) => {
    var listingID = req.body.id;
    Listing.find({ _id: listingID})
    .exec()
    .then((listing) => {
        console.log("found listing");
        res.render('viewListing', {
            layout: false,
            user: req.session.user,
            listing: listing.map(listing => listing.toJSON()),
        });
    });
});

// edit listing - change title route
app.post('/changeTitle', (req,res) => {
    var listingTitle = req.body.changeTitle;
    var listingID = req.body.listingID;
    Listing.updateOne(
        {_id: listingID},
        {$set: { title: listingTitle}})
    .exec()
    .then(() => {
        res.redirect('/displayAllRooms');
    })
    .catch((err) => {
        console.log(err);
    });
});

// edit listing - change description
app.post('/changeDescription', (req, res) => {
    var listingDescription = req.body.changeDrescription;
    var listingID = req.body.listingID;
    Listing.updateOne(
        {_id: listingID},
        {$set: { description: listingDescription}})
    .exec()
    .then(() => {
        res.redirect('/displayAllRooms');
    });
});

// edit listing - change location
app.post('/changeLocation', (req, res) => {
    var listingLocation = req.body.changeLocation;
    var listingID = req.body.listingID;
    Listing.updateOne(
        {_id: listingID},
        {$set: { location: listingLocation}})
    .exec()
    .then(() => {
        res.redirect('/displayAllRooms');
    });
});

// edit listing - change rate
app.post('/changeRate', (req, res) => {
    var listingRate = req.body.changeRate;
    var listingID = req.body.listingID;
    Listing.updateOne(
        {_id: listingID},
        {$set: { pricepernight: listingRate}})
    .exec()
    .then(() => {
        res.redirect('/displayAllRooms');
    });
});

// book listing route : Room description page
app.post('/bookListing', (req, res) => {
    var listingID = req.body.listingID;
    Listing.find({ _id: listingID})
    .exec()
    .then((listing) => {
        console.log("found listing");
        res.render('book', {
            layout: false,
            user: req.session.user,
            listing: listing.map(listing => listing.toJSON()),
        });
    });
});

// submit booking route
app.post('/submitBooking', (req, res) => {
    var newBooking = new Booking({
        userID: req.session.user.email,
        listingID : req.body.listingID,
        daysBooked : req.body.daysBooked,
        startDate : req.body.checkInInput,
        endDate : req.body.checkOutInput,
        totalPrice : req.body.totalPrice, 
    });
    newBooking.save((err) => {
        if (err) {
            console.log("error saving: " + err);
        } else {
            console.log("saved");
            res.redirect('/dashboard');
        }
    });
});

// delete session
app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/login");
  });

function onHttpsStart() {
    console.log("Express https server listening on: " + HTTPS_PORT);
}

function onHttpStart() {
    console.log("Express https server listening on: " + HTTP_PORT);
}

User.find({})
.exec()
.then((user) => {
    if(!user) {
        console.log("user not found");
    } else {
        console.log(user);
    }
    //process.exit();
})
.catch((err) => {
    console.log(`There was an error: ${err}`);
});


http.createServer(app).listen(HTTP_PORT, onHttpStart);
https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);
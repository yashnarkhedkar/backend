const express = require("express");
const mongoose = require('mongoose')
const Router = require("./routes/index.js")
const bodyParser = require('body-parser');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schema/user.js')
const bcrypt = require('bcryptjs')
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log('Connected');
});

app.use(Router)
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define the serializeUser function
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Define the deserializeUser function
passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });


app.post('/login', passport.authenticate('local'), (req, res) => {
    const token = jwt.sign({ id: req.user.id, email : req.body.email }, 'cat');
    res.send({ message: 'Login successful.', token });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    try {    
        User.findOne({ email: email })
            .then(user => {
                if (user === null) {
                    return done(null, false, { message: 'Incorrect email.' });
                } 
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            })
    } catch (error) {        
        return done(err);
    }
}));

app.listen(PORT, console.log(`Server started at ${PORT}`));

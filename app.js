const express = require("express");
const mongoose = require('mongoose')
const Router = require("./routes/index.js")
const passport = require('passport')
const cors = require('cors');
const { intializePassport, isAuthenticated } = require('./passportConfig.js');
const expressSession = require('express-session')

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
intializePassport(passport);
app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(expressSession({secret : 'secret', resave : false, saveUninitialized : false}))
app.use(passport.initialize())
app.use(passport.session());


app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send({ message: 'Login successful.', token });
});


app.get('/profile', isAuthenticated, (req, res) => {
    res.send(req.user)
})

app.listen(PORT, console.log(`Server started at ${PORT}`));

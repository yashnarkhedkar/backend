const express = require("express");
const Router = express.Router();
const userModel = require('../schema/user.js')
const url = require('url')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const querystring = require('querystring');
const passportLocal = require('passport-local').Strategy;

Router.get('/add_user', async (req, res) => {
    const parsedUrl = url.parse(req.url);
    const query = querystring.parse(parsedUrl.query);

    const alredyExist = await userModel.find({
        email: query.email,
    })
    if (alredyExist && Object.keys(alredyExist).length) {
        res.send('user alredy exist please login')
        return;
    }
    const hashedPass = await bcrypt.hash(query.password, 10)

    const user = new userModel({
        name: query.name,
        email: query.email,
        password: hashedPass,
        dob: query.date,
    });

    try {
        const Saveduser = await user.save();
        res.json(Saveduser);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Router.get("/get_user", async (req, res, next) => {
//     const parsedUrl = url.parse(req.url);
//     const query = querystring.parse(parsedUrl.query);

//     const user = await userModel.find({
//         email: query.email,
//     });
//     try {
//         console.log(user);
//         if(!user){
//             res.send("User not found");
//         } else if(user.length > 0 && user[0].password !== query.password){
//             res.end("Invalid credentials")
//         }
//         res.json(user);
//     } catch (error) {
//         console.log(error);
//     }
// });

  

Router.get("/allusers", async (req, res) => {
    const users = await userModel.find({});

    try {
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = Router;
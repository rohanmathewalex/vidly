const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User , validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
 
//register new user
router.post('/', async(req, res) => {
    //Validate the req if the name ,emaail,password is not valid return 400 error
    const{ error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //here Validate that the user is not already registered
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already Registred');

    //here we have a valid user object so save it to the database
    //here user object can also be modified
    //old convention
    /*
    {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
     */
    user = new User(_.pick(req.body,['name','email','password']));
    //hashing the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    //here we send response to the clint .We do't need to send the password
    //So we need to modify it
    //another method
    /*
       name: user.name,
        email: user.email
     */
    //here we use lodash package
    //here We send ths user object and pass the propertiesas ARRAY which we want to send as response
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(  _.pick(user,['_id','name','email']));
});
//now goto index.js and tell expres that for any routes hat starts api/users use the router that we exporting here
module.exports =router;
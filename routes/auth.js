//Here in this route we Authenticate the user hased password with plain text password
//Also authenticatie the mail id

const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.post('/', async(req,res) => {
    //validate req send by client
    const {error} = validate(req.body);
    if( error) return res.status(400).send(error.details[0].message);

//It verify the mail which client sends if does't exist exist return 400 status
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid EmailId or Password');

    // here compare the palin text password with hashed password if it valid return true else return false
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    //payload is passed any poperty we can send here in jwt Payload is passed as first argument
    //second passedis the secret key
    //Here when a uer logon it creates a json webtoken and return it on body response
    //generateAuthtoken is function written in user.js ,where user.js is responsible to getting user property
    const token = user.generateAuthToken();
    res.send(token);

});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req ,schema);
}
module.exports =router;




//This routes used to register new users
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        mminlength: 5,
        maxlength: 255,
        unique: true//to ensure that 2 user's with same email does't exists
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});
//here genrateAuthToken is method for object user
//this method is part of user object
//to get the property of user we use this operator
//while using this operator we need to use the regular function syntax
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        //Here we call email() method to ensure that it's valid email
        email: Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(255).required()
        
    };

    return Joi.validate(user, schema);
}
//if api/user it will be sent 
 exports.User = User;
 exports.validate = validateUser;

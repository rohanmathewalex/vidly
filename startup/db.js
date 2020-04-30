const winston = require('winston');
//require('winston-mongodb');
//require('express-async-errors');
const mongoose = require('mongoose'); 

module.exports = function() {
    mongoose.connect('mongodb://localhost/vidly')
  .then(() => winston.info('Connected to MongoDB...'));
  
}

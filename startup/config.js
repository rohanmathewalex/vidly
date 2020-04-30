const config = require('config'); 
module.exports = function() {
     
//when our application is starting we need to define the environment varialble otherwise our validation process
//goes wrong  . So if environment variable is not set then procees will exit
if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    
  }
}
const winston = require('winston');//default logger
require('winston-mongodb');
require('express-async-errors');
 
module.exports = function() {
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true}),
        new winston.transports.File({filename: 'uncaughtExceptions.log'}));//
      
      //If any unHandle Promise Rejecton ocuur then Log the error on console
      process.on('unhandledRejection', (ex)=>{
        throw ex;
      });
    
      //winston.add(new winston.transports.MongoDB, {db: 'mongodb://localhost/vidly'});
      //winston.add(winston.transports.File, { filename:' logfile.log' });
      //Refer npm winston documentation for more
      //Error Handelling . when errror occur we get log message and also we get the all detrails in the mongoDb database
     
//         let logger = winston.createLogger({
//             transports: [
//               new winston.transports.Console(),
//               new winston.transports.File({ filename: 'logfile.log' }),
//               //logging errors in database
//               new winston.transports.MongoDB({
//                 db: 'mongodb://localhost:/vidly',
//                 collection: 'log',
//                 level: 'info',
//                 storeHost: true,
//                 capped: true,
//             })
//             ]  
//           });
     
//       //this will log the info into the databse
//       logger.info("Test log!");
// }
// module.exports = logger
winston.add(winston.transports.File, {filename:' logfile.log' });
winston.add(winston.transports.MongoDB,{
    db: 'mongodb://localhost/vidly',
    level: 'info'
});
}
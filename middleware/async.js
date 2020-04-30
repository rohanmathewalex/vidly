
//We moved the try catch block inthe route handler to this asyncMiddleware function
//and pass a handleer which means out req,res are passed as an argument into this handler
module.exports = function asyncMiddleware(handler){
    return async(req, res, next) => {
      try {
        await handler(req,res);
      }
      catch(ex) {
        next(ex);
      }
    };
   }
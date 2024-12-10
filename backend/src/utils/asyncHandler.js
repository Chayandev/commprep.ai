//using promises
const asyncHandelr = (requestHandlr) => {
    return (req, res, next) => {
      Promise.resolve(requestHandlr(req, res, next)).catch((error) =>
        next(error),
      );
    };
  };
  
  export { asyncHandelr };